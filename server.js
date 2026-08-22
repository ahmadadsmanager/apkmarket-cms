const http = require('http');
const { gunzipSync } = require('zlib');
const mysql = require('mysql2/promise');

const PORT = Number(process.env.PORT || 3000);
let state = { status: 'starting', message: 'Importer starting', verification: null, error: null };

function readDumpB64() {
  const parts = [];
  for (let i = 1; i <= 999; i++) {
    const key = `SQL_DUMP_GZ_B64_${String(i).padStart(3,'0')}`;
    if (!(key in process.env)) break;
    parts.push(process.env[key] || '');
  }
  if (!parts.length && process.env.SQL_DUMP_GZ_B64) parts.push(process.env.SQL_DUMP_GZ_B64);
  if (!parts.length) throw new Error('No SQL dump variables found');
  return parts.join('');
}

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

async function runImport() {
  let conn;
  try {
    state = { status: 'running', message: 'Connecting to database', verification: null, error: null };
    conn = await getConnection();

    const current = await verify(conn);
    if (current.tableCount > 0 && process.env.FORCE_IMPORT !== '1') {
      state = { status: 'success', message: 'Database already contains tables; import skipped and existing data verified', verification: current, error: null };
      return;
    }

    const b64 = readDumpB64();
    const gz = Buffer.from(b64, 'base64');
    let sql = gunzipSync(gz).toString('utf8');

    // phpMyAdmin dumps from MariaDB are imported into the already-selected Railway database.
    // Comments naming the original cPanel database are harmless. Remove any CREATE/USE database statements if present.
    sql = sql.replace(/^CREATE DATABASE[^;]*;\s*$/gmi, '');
    sql = sql.replace(/^USE\s+`?[^`;\s]+`?;\s*$/gmi, '');

    state.message = `Executing SQL dump (${sql.length} bytes)`;
    await conn.query(sql);

    const verification = await verify(conn);
    state = { status: 'success', message: 'SQL dump imported and verified', verification, error: null };
  } catch (err) {
    state = { status: 'failed', message: 'Import failed', verification: null, error: err && (err.stack || err.message) || String(err) };
    console.error(state.error);
  } finally {
    if (conn) try { await conn.end(); } catch (_) {}
  }
}

const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  if (req.url === '/health') {
    res.statusCode = state.status === 'failed' ? 500 : 200;
    return res.end(JSON.stringify({ ok: state.status !== 'failed', status: state.status }));
  }
  res.statusCode = 200;
  res.end(JSON.stringify(state, null, 2));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Importer listening on ${PORT}`);
  runImport();
});
