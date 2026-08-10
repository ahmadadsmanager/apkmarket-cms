import Header from '@/components/Header';import Footer from '@/components/Footer';import Section from '@/components/Section';import Link from 'next/link';import {getApps,getCategories} from '@/lib/db';
export const dynamic='force-dynamic';
function compact(n=0){return n>=1e9?`${(n/1e9).toFixed(1)}B`:n>=1e6?`${(n/1e6).toFixed(1)}M`:String(n)}
export default async function Home(){
  const [featured,trending,latest,cats]=await Promise.all([getApps({featured:true,limit:8}),getApps({trending:true,limit:8}),getApps({limit:8}),getCategories()]);
  const heroApp=featured[0]||latest[0];
  return <><Header/><main>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow">Android apps, beautifully organised</span><h1>Find your next<br/><em>favourite app.</em></h1><p>Explore popular apps, games and fresh updates with clear versions, ratings and download information.</p><form className="hero-search" action="/search"><span>⌕</span><input name="q" placeholder="Search Spotify, WhatsApp, games..."/><button>Search</button></form><div className="hero-trust"><span>✓ Easy browsing</span><span>✓ Clear version info</span><span>✓ CMS managed</span></div></div>
      <div className="hero-showcase">
        {heroApp&&<Link className="featured-panel" href={`/app/${heroApp.slug}`}><div className="featured-label">FEATURED TODAY</div><div className="featured-app"><div className="hero-app-icon" style={heroApp.brand_color?{background:heroApp.brand_color}:undefined}><img src={heroApp.icon_url} alt=""/></div><div><span>{heroApp.category?.name}</span><h3>{heroApp.title}</h3><p>{heroApp.short_description}</p></div></div><div className="featured-meta"><span><b>★ {Number(heroApp.rating||0).toFixed(1)}</b> rating</span><span><b>{heroApp.version}</b> version</span><span><b>{heroApp.size}</b> size</span></div><div className="featured-cta">View app <span>→</span></div></Link>}
        <div className="floating-apps">{featured.slice(1,6).map(a=><Link href={`/app/${a.slug}`} key={a.id} className="floating-app"><div style={a.brand_color?{background:a.brand_color}:undefined}><img src={a.icon_url} alt=""/></div><span>{a.title}</span></Link>)}</div>
      </div>
    </div></section>

    <section className="quick-categories"><div className="container"><div className="quick-cat-head"><span>Browse categories</span><Link href="/categories">All categories →</Link></div><div className="category-grid">{cats.slice(0,7).map((c,i)=><Link href={`/category/${c.slug}`} className={`category-tile cat-${(i%4)+1}`} key={c.id}><span className="cat-glyph">{c.glyph||['▶','✦','◆','◉','♫','✉','◎'][i%7]}</span><div><strong>{c.name}</strong><small>{c.description}</small></div><span className="cat-arrow">↗</span></Link>)}</div></div></section>

    <div className="container content-home">
      <Section title="Popular right now" subtitle="Apps people are looking for today" apps={trending.slice(0,8)} />
      <section className="editorial-banner"><div><span className="eyebrow dark">Built for discovery</span><h2>A cleaner way to browse Android.</h2><p>Focused app pages, useful specifications and a fast search experience without visual clutter.</p><Link href="/apps">Explore all apps →</Link></div><div className="banner-icons">{latest.slice(0,6).map(a=><div key={a.id} style={a.brand_color?{background:a.brand_color}:undefined}><img src={a.icon_url} alt=""/></div>)}</div></section>
      <Section title="Fresh updates" subtitle="Recently added and updated listings" apps={latest.slice(0,8)} href="/latest" />
    </div>
  </main><Footer/></>
}
