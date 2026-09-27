import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import darkLogo from '../assets/logo-dark.png'
import { useSite } from '../context/SiteContext'
import { INSTAGRAM_LINK } from '../data/fabrics'

export default function Footer() {
  const { theme, t } = useSite()
  return (
    <footer
      className="site-footer px-8 lg:px-20 py-16 flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left"
      style={{ background: 'var(--footer-bg)' }}
    >
      <div className="flex flex-col items-center md:items-start gap-4">
        <img
          src={darkLogo}
          alt="SA Studio"
          className="h-12 w-auto object-contain"
        />
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="text-sm tracking-[0.12em] text-white/70">
            © {new Date().getFullYear()} SA Studio. {t('footerRights')}
          </p>
          <div className="flex items-center gap-2 text-sm tracking-[0.12em] text-white/70">
            <span>Powered by</span>
            <a 
              href="https://crewlytech.com" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Crewly"
              className="inline-flex items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="/images/footer/crewly-icon.png" 
                alt="Crewly" 
                className="h-5 w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:justify-end">
        {[
          { to: '/',            label: t('home') },
          { to: '/collections', label: t('collections') },
          { to: '/about',       label: t('about') },
          { to: '/contact',     label: t('contactUs') },
          { to: '/privacy',     label: 'Privacy' },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="font-sans text-sm tracking-[0.14em] uppercase text-white/80 hover:text-white transition-colors"
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
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
    </footer>
  )
}