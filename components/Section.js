import Link from 'next/link'; import AppCard from './AppCard';
export default function Section({title,apps,href='/apps'}){ if(!apps?.length)return null; return <section className="home-section"><div className="section-title"><h2>{title}</h2><Link href={href}>View all →</Link></div><div className="app-grid">{apps.map(a=><AppCard key={a.id} app={a}/>)}</div></section> }
