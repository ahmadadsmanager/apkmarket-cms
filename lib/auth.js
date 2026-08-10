import crypto from 'crypto';

const COOKIE = 'apk_admin_session';
function secret(){ return process.env.ADMIN_SESSION_SECRET || ''; }
function sig(payload){ return crypto.createHmac('sha256', secret()).update(payload).digest('base64url'); }
export function makeSession(email) {
  const payload = Buffer.from(JSON.stringify({email, exp: Date.now()+1000*60*60*12})).toString('base64url');
  return `${payload}.${sig(payload)}`;
}
export function verifySession(token) {
  try {
    if (!token || !secret()) return false;
    const [payload, signature]=token.split('.');
    if (!payload || !signature) return false;
    const a=Buffer.from(signature), b=Buffer.from(sig(payload));
    if (a.length!==b.length || !crypto.timingSafeEqual(a,b)) return false;
    const data=JSON.parse(Buffer.from(payload,'base64url').toString());
    return data.exp>Date.now() && data.email===process.env.ADMIN_EMAIL;
  } catch { return false; }
}
export function cookieName(){ return COOKIE; }
export function credentialsValid(email,password){
  const a=Buffer.from(String(email||'')), b=Buffer.from(String(process.env.ADMIN_EMAIL||''));
  const c=Buffer.from(String(password||'')), d=Buffer.from(String(process.env.ADMIN_PASSWORD||''));
  return a.length===b.length && c.length===d.length && crypto.timingSafeEqual(a,b) && crypto.timingSafeEqual(c,d);
}
