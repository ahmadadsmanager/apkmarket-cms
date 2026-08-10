import crypto from 'crypto';
function getKey(){
  const raw=process.env.ENCRYPTION_KEY || '';
  if (/^[a-f0-9]{64}$/i.test(raw)) return Buffer.from(raw,'hex');
  return crypto.createHash('sha256').update(raw).digest();
}
export function encrypt(value){
  if(!value) return '';
  const iv=crypto.randomBytes(12); const cipher=crypto.createCipheriv('aes-256-gcm',getKey(),iv);
  const enc=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]); const tag=cipher.getAuthTag();
  return `${iv.toString('hex')}.${tag.toString('hex')}.${enc.toString('hex')}`;
}
export function decrypt(value){
  if(!value) return '';
  try { const [iv,tag,data]=value.split('.').map(x=>Buffer.from(x,'hex')); const dec=crypto.createDecipheriv('aes-256-gcm',getKey(),iv); dec.setAuthTag(tag); return Buffer.concat([dec.update(data),dec.final()]).toString('utf8'); } catch { return ''; }
}
