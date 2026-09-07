import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import { useSite } from '../context/SiteContext'
import { INSTAGRAM_LINK } from '../data/fabrics'

export default function Footer() {
  const { t } = useSite()
  return (
    <footer
      className="site-footer px-6 lg:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
      style={{ background: 'var(--footer-bg)' }}
    >
      <img
        src={logo}
        alt="SA Studio"
        className="h-8 w-auto object-contain brightness-0 invert"
      />

      <p className="text-xs tracking-[0.12em] text-white/70">
        © {new Date().getFullYear()} SA Studio. {t('footerRights')}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-end">
        {[
          { to: '/',            label: t('home') },
          { to: '/collections', label: t('collections') },
          { to: '/about',       label: t('about') },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="font-sans text-xs tracking-[0.12em] uppercase text-white/75 hover:text-white transition-colors"
          >
            {label}
          </Link>
        ))}
        <a
          href={INSTAGRAM_LINK}
          target="_blank"
          rel="noreferrer"
          aria-label="SA Studio on Instagram"
          title="Instagram"
          className="text-white/75 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
    </footer>
  )
}