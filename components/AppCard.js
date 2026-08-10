import Link from 'next/link';
function compact(n=0){return n>=1e9?`${(n/1e9).toFixed(n>=1e10?0:1)}B`:n>=1e6?`${(n/1e6).toFixed(n>=1e7?0:1)}M`:n>=1e3?`${Math.round(n/1e3)}K`:String(n)}
export default function AppCard({app,compactCard=false}){
  const branded=Boolean(app.brand_color);
  return <Link href={`/app/${app.slug}`} className={`app-card ${compactCard?'compact-card':''}`}>
    <div className="app-card-main">
      <div className={`app-icon-shell ${branded?'brand-icon':''}`} style={branded?{background:app.brand_color}:undefined}><img src={app.icon_url||'/demo/icons/default.svg'} alt={`${app.title} icon`} /></div>
      <div className="app-card-copy"><div className="app-title-line"><h3>{app.title}</h3>{app.mod_info&&<span className="mod-badge">MOD</span>}</div><p>{app.category?.name||'Android App'}</p><div className="rating-line"><span className="star">★</span><strong>{Number(app.rating||0).toFixed(1)}</strong><span>•</span><span>{compact(app.downloads)}+</span></div></div>
    </div>
    {!compactCard&&<div className="card-bottom"><span>v{app.version||'Latest'}</span><span className="card-arrow">View app →</span></div>}
  </Link>
}
