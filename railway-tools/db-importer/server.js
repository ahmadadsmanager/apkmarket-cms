const http = require('http');
const { gunzipSync, brotliDecompressSync } = require('zlib');
const mysql = require('mysql2/promise');

const PORT = Number(process.env.PORT || 3000);
let state = { status: 'ready', message: 'Waiting for SQL import', verification: null, error: null };

async function getConnection() {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  if (!host || !user || !password || !database) throw new Error('Missing DB_HOST/DB_USER/DB_PASSWORD/DB_NAME');
  return mysql.createConnection({ host, port, user, password, database, multipleStatements: true, connectTimeout: 15000 });
}

async function verify(conn) {
  const [rows] = await conn.query(`SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() ORDER BY TABLE_NAME`);
  const out = {};
  for (const row of rows) {
    const name = row.TABLE_NAME;
    const [countRows] = await conn.query('SELECT COUNT(*) AS c FROM ??', [name]);
    out[name] = Number(countRows[0].c || 0);
  }
  return { database: process.env.DB_NAME, tableCount: rows.length, tables: out };
}

async function resetDatabase(conn) {
  const [rows] = await conn.query(`SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()`);
  if (!rows.length) return;
  await conn.query('SET FOREIGN_KEY_CHECKS=0');
  try {
    for (const row of rows) await conn.query('DROP TABLE IF EXISTS ??', [row.TABLE_NAME]);
  } finally {
    await conn.query('SET FOREIGN_KEY_CHECKS=1');
  }
}

function makeMysqlCompatible(sql) {
  sql = sql.replace(/\b((?:tiny|medium|long)?text|(?:tiny|medium|long)?blob)\s+DEFAULT\s+'(?:''|[^'])*'/gi, '$1');
  sql = sql.replace(/\b((?:tiny|medium|long)?text|(?:tiny|medium|long)?blob)\s+DEFAULT\s+"(?:""|[^"])*"/gi, '$1');
  sql = sql.replace(/^CREATE DATABASE[^;]*;\s*$/gmi, '');
  sql = sql.replace(/^USE\s+`?[^`;\s]+`?;\s*$/gmi, '');
  return sql;
}

async function importSql(sql) {
  let conn;
  try {
    state = { status: 'running', message: `Preparing ${sql.length} bytes`, verification: null, error: null };
    console.log('[IMPORT] starting', JSON.stringify({ bytes: sql.length, db: process.env.DB_NAME, force: process.env.FORCE_IMPORT === '1' }));
    conn = await getConnection();
    const current = await verify(conn);
    if (current.tableCount > 0 && process.env.FORCE_IMPORT !== '1') {
      state = { status: 'success', message: 'Database already contains tables; import skipped and existing data verified', verification: current, error: null };
      console.log('[IMPORT_RESULT]', JSON.stringify(state));
      return state;
    }
    if (process.env.FORCE_IMPORT === '1') await resetDatabase(conn);
    sql = makeMysqlCompatible(sql);
    state.message = `Executing SQL dump (${sql.length} bytes)`;
    await conn.query(sql);
    const verification = await verify(conn);
    state = { status: 'success', message: 'SQL dump imported and verified', verification, error: null };
    console.log('[IMPORT_RESULT]', JSON.stringify(state));
    return state;
  } catch (err) {
    state = { status: 'failed', message: 'Import failed', verification: null, error: err && (err.stack || err.message) || String(err) };
    console.error('[IMPORT_RESULT]', JSON.stringify(state));
    return state;
  } finally {
    if (conn) try { await conn.end(); } catch (_) {}
  }
}

function readChunkSeries(prefix) {
  const parts = [];
  for (let i = 1; i <= 999; i++) {
    const key = `${prefix}${String(i).padStart(3, '0')}`;
    const value = process.env[key];
    if (!value) break;
    parts.push(value);
  }
  return parts;
}

function sqlFromEnvChunks() {
  if (process.env.SQL_DUMP_BR_B64) {
    console.log('[IMPORT] loaded single Brotli SQL variable');
    return brotliDecompressSync(Buffer.from(process.env.SQL_DUMP_BR_B64, 'base64')).toString('utf8');
  }
  const brParts = readChunkSeries('SQL_DUMP_BR_B64_');
  if (brParts.length) {
    console.log('[IMPORT] loaded Brotli SQL chunks', brParts.length);
    return brotliDecompressSync(Buffer.from(brParts.join(''), 'base64')).toString('utf8');
  }
  if (process.env.SQL_DUMP_GZ_B64) {
    console.log('[IMPORT] loaded single gzip SQL variable');
    return gunzipSync(Buffer.from(process.env.SQL_DUMP_GZ_B64, 'base64')).toString('utf8');
  }
  const gzParts = readChunkSeries('SQL_DUMP_GZ_B64_');
  if (gzParts.length) {
    console.log('[IMPORT] loaded gzip SQL chunks', gzParts.length);
    return gunzipSync(Buffer.from(gzParts.join(''), 'base64')).toString('utf8');
  }
  return null;
}

const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  if (req.url === '/health' && req.method === 'GET') {
    res.statusCode = 200;
    return res.end(JSON.stringify({ ok: true, status: state.status }));
  }
  if (req.url === '/status' && req.method === 'GET') {
    res.statusCode = 200;
    return res.end(JSON.stringify(state, null, 2));
  }
  if (req.url === '/import' && req.method === 'POST') {
    if (!process.env.IMPORT_TOKEN || req.headers['x-import-token'] !== process.env.IMPORT_TOKEN) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'unauthorized' }));
    }
    const chunks = [];
    let size = 0;
    req.on('data', c => {
      size += c.length;
      if (size > 5 * 1024 * 1024) req.destroy(new Error('payload too large'));
      else chunks.push(c);
    });
    req.on('end', async () => {
      const result = await importSql(Buffer.concat(chunks).toString('utf8'));
      res.statusCode = result.status === 'success' ? 200 : 500;
      res.end(JSON.stringify(result, null, 2));
    });
    req.on('error', err => {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: err.message }));
    });
    return;
  }
  res.statusCode = 200;
  res.end(JSON.stringify({ service: 'railway-db-importer', status: state.status }));
});

server.listen(PORT, '0.0.0.0', async () => {
  console.log(`Importer listening on ${PORT}`);
  if (process.env.AUTO_IMPORT === '1') {
    try {
      const sql = sqlFromEnvChunks();
      if (!sql) {
        state = { status: 'failed', message: 'AUTO_IMPORT enabled but no SQL chunks found', verification: null, error: 'missing SQL dump data' };
        console.error('[IMPORT_RESULT]', JSON.stringify(state));
      } else {
        await importSql(sql);
      }
    } catch (err) {
      state = { status: 'failed', message: 'Failed to decode/import SQL chunks', verification: null, error: err && (err.stack || err.message) || String(err) };
      console.error('[IMPORT_RESULT]', JSON.stringify(state));
    }
  }
});
