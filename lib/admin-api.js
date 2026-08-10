import { cookies } from 'next/headers';
import { verifySession, cookieName } from './auth';
export async function requireAdmin(){
  const store=await cookies();
  if(!verifySession(store.get(cookieName())?.value)) throw new Error('UNAUTHORIZED');
}
export function safeSlug(v=''){ return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
export function cleanApp(body){
  const specs=Array.isArray(body.specifications)?body.specifications.filter(x=>x?.label&&x?.value):[];
  const features=Array.isArray(body.features)?body.features.filter(Boolean):[];
  let schema_json=null;
  if(body.schema_json){
    if(typeof body.schema_json==='string') schema_json=JSON.parse(body.schema_json);
    else schema_json=body.schema_json;
  }
  return {
    title:String(body.title||'').trim(), slug:safeSlug(body.slug||body.title), short_description:String(body.short_description||'').trim(), developer:String(body.developer||'').trim(),
    category_id:body.category_id?Number(body.category_id):null, app_type:body.app_type==='game'?'game':'app', version:String(body.version||'').trim(), android_required:String(body.android_required||'').trim(), size:String(body.size||'').trim(),
    rating:Math.max(0,Math.min(5,Number(body.rating||0))), downloads:Math.max(0,Number(body.downloads||0)), icon_url:String(body.icon_url||''), featured_image:String(body.featured_image||''), screenshots:Array.isArray(body.screenshots)?body.screenshots:[],
    apk_url:String(body.apk_url||''), mod_info:String(body.mod_info||''), features, specifications:specs, content_html:String(body.content_html||''), schema_json,
    seo_title:String(body.seo_title||'').trim(), meta_description:String(body.meta_description||'').trim(), canonical_url:String(body.canonical_url||'').trim(), robots:String(body.robots||'index,follow'), status:['draft','published'].includes(body.status)?body.status:'draft',
    featured:Boolean(body.featured), trending:Boolean(body.trending), updated_at:new Date().toISOString()
  };
}
