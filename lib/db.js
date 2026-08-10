import mysql from 'mysql2/promise';
import { demoApps, demoCategories, demoPages } from './demo-data';

export const configured = Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER);
let pool;
function db(){
  if(!configured) throw new Error('MySQL is not configured');
  if(!pool) pool=mysql.createPool({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD||'',database:process.env.DB_NAME,waitForConnections:true,connectionLimit:8,charset:'utf8mb4'});
  return pool;
}
const JSON_FIELDS=new Set(['screenshots','features','specifications','schema_json']);
const BOOL_FIELDS=new Set(['featured','trending','is_read','smtp_secure']);
function decodeRow(row){
  if(!row) return row;
  const out={...row};
  for(const k of JSON_FIELDS){ if(typeof out[k]==='string'){ try{out[k]=JSON.parse(out[k])}catch{out[k]=k==='schema_json'?null:[]} } }
  for(const k of BOOL_FIELDS){ if(k in out) out[k]=Boolean(out[k]); }
  return out;
}
function encodePayload(payload){
  const out={...payload};
  for(const k of JSON_FIELDS){ if(k in out) out[k]=out[k]==null?null:JSON.stringify(out[k]); }
  for(const k of BOOL_FIELDS){ if(k in out) out[k]=out[k]?1:0; }
  return out;
}
const allowedTables=new Set(['apps','categories','pages','contacts','settings']);
export async function select(table, query=''){
  if(!allowedTables.has(table)) throw new Error('Invalid table');
  if(!configured) return [];
  let sql=`SELECT * FROM \`${table}\``;
  if(table==='contacts') sql+=' ORDER BY created_at DESC';
  else if(table==='pages') sql+=' ORDER BY title ASC';
  else if(table==='categories') sql+=' ORDER BY name ASC';
  const m=String(query).match(/limit=(\d+)/); if(m) sql+=` LIMIT ${Number(m[1])}`;
  const [rows]=await db().query(sql); return rows.map(decodeRow);
}
export async function insert(table,payload){
  if(!allowedTables.has(table)) throw new Error('Invalid table');
  const p=encodePayload(payload); const keys=Object.keys(p); const vals=keys.map(k=>p[k]);
  const sql=`INSERT INTO \`${table}\` (${keys.map(k=>`\`${k}\``).join(',')}) VALUES (${keys.map(()=>'?').join(',')})`;
  const [r]=await db().execute(sql,vals); const [rows]=await db().execute(`SELECT * FROM \`${table}\` WHERE id=? LIMIT 1`,[r.insertId]); return rows.map(decodeRow);
}
export async function update(table,id,payload){
  if(!allowedTables.has(table)) throw new Error('Invalid table');
  const p=encodePayload(payload); const keys=Object.keys(p); if(!keys.length) return [];
  await db().execute(`UPDATE \`${table}\` SET ${keys.map(k=>`\`${k}\`=?`).join(',')} WHERE id=?`,[...keys.map(k=>p[k]),id]);
  const [rows]=await db().execute(`SELECT * FROM \`${table}\` WHERE id=? LIMIT 1`,[id]); return rows.map(decodeRow);
}
export async function remove(table,id){ if(!allowedTables.has(table)) throw new Error('Invalid table'); await db().execute(`DELETE FROM \`${table}\` WHERE id=?`,[id]); }
function attachCategory(apps,categories){ const map=new Map(categories.map(c=>[Number(c.id),c])); return apps.map(a=>({...a,category:map.get(Number(a.category_id))||null})); }
export async function getCategories(){ if(!configured) return demoCategories; const [rows]=await db().query('SELECT * FROM categories ORDER BY name ASC'); return rows.map(decodeRow); }
export async function getApps({limit=100,featured,trending,type,categorySlug,q,status='published'}={}){
  if(!configured){ let rows=[...demoApps]; if(status)rows=rows.filter(a=>a.status===status); if(featured!==undefined)rows=rows.filter(a=>a.featured===featured); if(trending!==undefined)rows=rows.filter(a=>a.trending===trending); if(type)rows=rows.filter(a=>a.app_type===type); if(categorySlug)rows=rows.filter(a=>a.category?.slug===categorySlug); if(q){const x=q.toLowerCase();rows=rows.filter(a=>`${a.title} ${a.short_description} ${a.developer}`.toLowerCase().includes(x));} return rows.slice(0,limit); }
  const where=[]; const vals=[]; if(status){where.push('a.status=?');vals.push(status)} if(featured!==undefined){where.push('a.featured=?');vals.push(featured?1:0)} if(trending!==undefined){where.push('a.trending=?');vals.push(trending?1:0)} if(type){where.push('a.app_type=?');vals.push(type)} if(categorySlug){where.push('c.slug=?');vals.push(categorySlug)} if(q){where.push('(a.title LIKE ? OR a.short_description LIKE ? OR a.developer LIKE ?)'); const s=`%${q}%`;vals.push(s,s,s)}
  const sql=`SELECT a.*,c.id c_id,c.name c_name,c.slug c_slug,c.description c_description FROM apps a LEFT JOIN categories c ON c.id=a.category_id ${where.length?'WHERE '+where.join(' AND '):''} ORDER BY a.updated_at DESC LIMIT ${Math.max(1,Number(limit)||100)}`;
  const [rows]=await db().execute(sql,vals); return rows.map(r=>{const a=decodeRow(r); a.category=r.c_id?{id:r.c_id,name:r.c_name,slug:r.c_slug,description:r.c_description}:null; delete a.c_id;delete a.c_name;delete a.c_slug;delete a.c_description; return a;});
}
export async function getAppBySlug(slug){ if(!configured)return demoApps.find(a=>a.slug===slug)||null; const rows=await getApps({limit:500,status:null}); return rows.find(a=>a.slug===slug)||null; }
export async function getAppById(id){ if(!configured)return demoApps.find(a=>String(a.id)===String(id))||null; const [rows]=await db().execute('SELECT * FROM apps WHERE id=? LIMIT 1',[id]); return decodeRow(rows[0])||null; }
export async function getAllAppsAdmin(){ if(!configured)return demoApps; const cats=await getCategories(); const [rows]=await db().query('SELECT * FROM apps ORDER BY updated_at DESC'); return attachCategory(rows.map(decodeRow),cats); }
export async function getPages(){ if(!configured)return Object.values(demoPages); const [rows]=await db().query('SELECT * FROM pages ORDER BY title ASC'); return rows.map(decodeRow); }
export async function getPage(slug){ if(!configured)return demoPages[slug]||null; const [rows]=await db().execute('SELECT * FROM pages WHERE slug=? LIMIT 1',[slug]); return decodeRow(rows[0])||null; }
export async function getSettings(){ if(!configured)return {site_name:'APKMarket',site_tagline:'Discover apps & games',notification_email:'',smtp_host:'smtp.gmail.com',smtp_port:465,smtp_secure:true,smtp_user:'',smtp_password_encrypted:''}; const [rows]=await db().execute('SELECT * FROM settings WHERE id=1 LIMIT 1'); return decodeRow(rows[0])||{}; }
