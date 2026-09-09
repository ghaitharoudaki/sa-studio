import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'
import darkLogo from '../assets/logo-dark.png'
import { useSite } from '../context/SiteContext'
import { WHATSAPP_BASE } from '../data/fabrics'

function ThemeIcon({ theme }) {
  if (theme === 'light') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-icon">
        <circle cx="12" cy="12" r="4" fill="currentColor" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-icon">
      <path d="M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5 8.5 8.5 0 1 0 20.5 14.7Z" fill="currentColor" />
    </svg>
  )
}

export default function Navbar() {
  const [navExpanded, setNavExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme, toggleLanguage, t } = useSite()
  const quotationLink = `${WHATSAPP_BASE}?text=${encodeURIComponent('Hello, I would like to request a quotation from SA Studio.')}`

  const links = [
    { to: '/', label: t('home') },
    { to: '/about', label: t('about') },
    { to: '/collections', label: t('collections') },
    { to: '/contact', label: t('contactUs') },
  ]

  const isActive = (path) => location.pathname === path
  const closeMobileMenu = () => setMobileOpen(false)

  return (
    <>
      <nav className="site-nav">
        <div className="site-nav-inner mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-16">
          <div className="site-nav-top">
            <Link to="/" className="site-nav-logo-link">
              <img src={theme === 'dark' ? darkLogo : logo} alt="SA Studio" className="site-logo" />
            </Link>

            <div className="site-nav-desktop-tools">
              <button type="button" onClick={toggleLanguage} className="site-nav-language" aria-label="Change language">
                {t('language')}
              </button>
              <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                <ThemeIcon theme={theme} />
              </button>
              <a href={quotationLink} target="_blank" rel="noreferrer" className="site-nav-quotation">
                <span className="mobile-quotation-full">{t('requestQuotation')}</span>
                <span className="mobile-quotation-short">{t('requestQuotationShort')}</span>
              </a>
            </div>

            <div className="site-nav-mobile-tools">
              <a href={quotationLink} target="_blank" rel="noreferrer" className="site-nav-quotation">
                {t('requestQuotation')}
              </a>
              <button type="button" className={`site-nav-hamburger ${mobileOpen ? 'is-open' : ''}`} onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>

          <div className={`site-nav-row ${navExpanded ? 'is-open' : ''}`} aria-hidden={!navExpanded}>
            <div className="site-nav-links">
              {links.map(({ to, label }) => (
                <Link key={to} to={to} onClick={closeMobileMenu} className={isActive(to) ? 'is-active' : ''}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <button type="button" className={`site-nav-chevron ${navExpanded ? 'is-open' : ''}`} onClick={() => setNavExpanded((expanded) => !expanded)} aria-label={navExpanded ? 'Collapse navigation' : 'Expand navigation'} aria-expanded={navExpanded}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
        </button>
      </nav>

      <div className={`site-nav-backdrop ${mobileOpen ? 'is-open' : ''}`} onClick={closeMobileMenu} />
      <aside className={`site-nav-mobile-panel ${mobileOpen ? 'is-open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="site-nav-mobile-links">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={closeMobileMenu} className={isActive(to) ? 'is-active' : ''}>{label}</Link>
          ))}
        </div>
        <div className="site-nav-mobile-settings">
          <button type="button" onClick={toggleLanguage}>{t('language')}</button>
          <button type="button" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}><ThemeIcon theme={theme} /></button>
        </div>
      </aside>
    </>
  )
}