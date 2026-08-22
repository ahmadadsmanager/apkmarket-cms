const http = require('http');
const { gunzipSync } = require('zlib');
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

async function importSql(sql) {
  let conn;
  try {
    state = { status: 'running', message: `Importing ${sql.length} bytes`, verification: null, error: null };
    conn = await getConnection();
    const current = await verify(conn);
    if (current.tableCount > 0 && process.env.FORCE_IMPORT !== '1') {
      state = { status: 'success', message: 'Database already contains tables; import skipped and existing data verified', verification: current, error: null };
      return state;
    }
    sql = sql.replace(/^CREATE DATABASE[^;]*;\s*$/gmi, '');
    sql = sql.replace(/^USE\s+`?[^`;\s]+`?;\s*$/gmi, '');
    await conn.query(sql);
    const verification = await verify(conn);
    state = { status: 'success', message: 'SQL dump imported and verified', verification, error: null };
    return state;
  } catch (err) {
    state = { status: 'failed', message: 'Import failed', verification: null, error: err && (err.stack || err.message) || String(err) };
    console.error(state.error);
    return state;
  } finally {
    if (conn) try { await conn.end(); } catch (_) {}
  }
}

function sqlFromEnvChunks() {
  const parts = [];
  for (let i = 1; i <= 999; i++) {
    const key = `SQL_DUMP_GZ_B64_${String(i).padStart(3, '0')}`;
    const value = process.env[key];
    if (!value) break;
    parts.push(value);
  }
  if (!parts.length) return null;
  return gunzipSync(Buffer.from(parts.join(''), 'base64')).toString('utf8');
}

const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  if (req.url === '/health' && req.method === 'GET') {
    res.statusCode = state.status === 'failed' ? 500 : 200;
    return res.end(JSON.stringify({ ok: state.status !== 'failed', status: state.status }));
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
      if (!sql) state = { status: 'failed', message: 'AUTO_IMPORT enabled but no SQL chunks found', verification: null, error: 'missing SQL_DUMP_GZ_B64_001' };
      else await importSql(sql);
    } catch (err) {
      state = { status: 'failed', message: 'Failed to decode/import SQL chunks', verification: null, error: err && (err.stack || err.message) || String(err) };
      console.error(state.error);
    }
  }
});
