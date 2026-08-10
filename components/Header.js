import Link from 'next/link';
export default function Header(){
  return <header className="site-header"><div className="container header-inner">
    <Link className="brand" href="/"><span className="brand-mark"><span>A</span></span><span className="brand-name">APKMarket</span></Link>
    <form className="search" action="/search"><span className="search-icon">⌕</span><input name="q" placeholder="Search apps & games" aria-label="Search apps" /></form>
    <nav><Link href="/apps">Apps</Link><Link href="/games">Games</Link><Link href="/categories">Categories</Link><Link href="/latest">Updates</Link></nav>
  </div></header>
}
