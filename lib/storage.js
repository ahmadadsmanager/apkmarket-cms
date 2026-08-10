import fs from 'fs/promises';
import path from 'path';

export async function uploadToStorage(file,bucket='media'){
  const original=file.name||'upload.bin';
  const safe=original.toLowerCase().replace(/[^a-z0-9._-]+/g,'-');
  const day=new Date().toISOString().slice(0,10);
  const root=process.env.UPLOAD_DIR || path.join(process.cwd(),'public','uploads');
  const folder=path.join(root,bucket,day);
  await fs.mkdir(folder,{recursive:true});
  const filename=`${Date.now()}-${safe}`;
  await fs.writeFile(path.join(folder,filename),Buffer.from(await file.arrayBuffer()));
  const base=(process.env.UPLOAD_PUBLIC_URL||'/uploads').replace(/\/$/,'');
  return `${base}/${bucket}/${day}/${filename}`;
}
