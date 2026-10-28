import { Link, useLocation } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { useFavorites } from '../hooks/useFavorites'

function Icon({ type }) {
  if (type === 'home') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
  if (type === 'heart') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="m20 20-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
}

export default function MobileBottomNav() {
  const { t } = useSite()
  const { favoriteIds } = useFavorites()
  const location = useLocation()
  const links = [
    { to: '/', label: t('home'), icon: 'home' },
    { to: '/collections', label: t('collections'), icon: 'search' },
    { to: '/favorites', label: t('favorites'), icon: 'heart', count: favoriteIds.length },
  ]

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
      {links.map((link) => (
        <Link key={link.to} to={link.to} className={location.pathname === link.to || (link.to === '/collections' && location.pathname.startsWith('/collections/')) ? 'is-active' : ''} aria-current={location.pathname === link.to ? 'page' : undefined}>
          <span className="mobile-bottom-nav-icon"><Icon type={link.icon} />{link.count > 0 && <b aria-hidden="true">{link.count}</b>}</span>
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
  )
}
