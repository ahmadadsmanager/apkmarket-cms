'use client';
import {useEffect,useRef} from 'react';
export default function RichEditor({value,onChange}){
  const ref=useRef(null);
  useEffect(()=>{ if(ref.current && ref.current.innerHTML!==value) ref.current.innerHTML=value||''; },[]);
  const exec=(cmd,val)=>{document.execCommand(cmd,false,val);ref.current?.focus();onChange(ref.current?.innerHTML||'')};
  const block=(tag)=>exec('formatBlock',tag);
  async function image(){ const input=document.createElement('input'); input.type='file'; input.accept='image/*'; input.onchange=async()=>{const f=input.files?.[0];if(!f)return;const fd=new FormData();fd.append('file',f);fd.append('bucket','media');const r=await fetch('/api/admin/upload',{method:'POST',body:fd});const j=await r.json();if(!r.ok)return alert(j.error||'Upload failed');exec('insertImage',j.url)};input.click(); }
  function table(){ const rows=Math.max(1,Number(prompt('Rows?','3')||3)), cols=Math.max(1,Number(prompt('Columns?','3')||3)); let html='<table><tbody>';for(let r=0;r<rows;r++){html+='<tr>';for(let c=0;c<cols;c++)html+=`<${r===0?'th':'td'}>${r===0?'Heading':'Cell'}</${r===0?'th':'td'}>`;html+='</tr>'}html+='</tbody></table><p></p>';exec('insertHTML',html); }
  function link(){const u=prompt('URL');if(u)exec('createLink',u)}
  return <div className="editor-wrap"><div className="editor-toolbar"><button type="button" onClick={()=>block('p')}>P</button><button type="button" onClick={()=>block('h2')}>H2</button><button type="button" onClick={()=>block('h3')}>H3</button><button type="button" onClick={()=>block('h4')}>H4</button><button type="button" onClick={()=>exec('bold')}><b>B</b></button><button type="button" onClick={()=>exec('italic')}><i>I</i></button><button type="button" onClick={()=>exec('insertUnorderedList')}>• List</button><button type="button" onClick={()=>exec('insertOrderedList')}>1. List</button><button type="button" onClick={link}>Link</button><button type="button" onClick={table}>Table</button><button type="button" onClick={image}>Image</button><button type="button" onClick={()=>exec('removeFormat')}>Clear</button></div><div ref={ref} className="editor" contentEditable suppressContentEditableWarning onInput={e=>onChange(e.currentTarget.innerHTML)} /></div>
}
