import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.jpg'
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
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme, toggleLanguage, t } = useSite()
  const quotationLink = `${WHATSAPP_BASE}?text=${encodeURIComponent('Hello, I would like to request a quotation from SA Studio.')}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Navigation changes intentionally close the mobile drawer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
  }, [location.pathname])

  const links = [
    { to: '/',            label: t('home') },
    { to: '/collections', label: t('collections') },
    { to: '/about',       label: t('about') },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav
        className={`site-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-deep' : ''
        }`}
        style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(22px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 h-[72px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="SA Studio"
              className="site-logo h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`relative text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
                  isActive(to)
                    ? 'text-forest'
                    : 'text-charcoal-light hover:text-forest'
                }`}
              >
                <span className="relative inline-flex items-center gap-1">
                  {label}
                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-forest transition-opacity duration-200 ${
                      isActive(to) ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="min-h-[44px] px-3 text-[11px] tracking-[0.12em] uppercase text-charcoal-light hover:text-forest transition-colors"
              aria-label="Change language"
            >
              {t('language')}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle min-h-[40px] min-w-[40px] text-charcoal-light hover:text-forest transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <ThemeIcon theme={theme} />
            </button>
            <a
              href={quotationLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-[11px] tracking-[0.18em] uppercase px-6 py-2.5 rounded-full border border-forest text-forest hover:bg-forest hover:text-white transition-all duration-200 min-h-[44px]"
            >
              {t('requestQuotation')}
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 min-w-[44px] min-h-[44px] items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-px bg-charcoal block transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-6 h-px bg-charcoal block transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-px bg-charcoal block transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[85vw] max-w-sm bg-cream shadow-deep transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col px-6 pt-24 pb-10 gap-8 h-full">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="font-sans text-4xl font-light text-charcoal border-b border-cream-dark pb-6 hover:text-forest transition-colors"
            >
              {label}
            </Link>
          ))}
          <a
            href={quotationLink}
            target="_blank"
            rel="noreferrer"
            className="mt-auto text-center text-xs tracking-[0.2em] uppercase px-5 py-4 border border-forest text-forest min-h-[44px] flex items-center justify-center hover:bg-forest hover:text-white transition-all duration-200"
          >
            {t('requestQuotation')}
          </a>
          <div className="mt-6 flex items-center justify-between border-t border-cream-dark pt-6">
            <button type="button" onClick={toggleLanguage} className="text-xs text-charcoal-light hover:text-forest">
              {t('language')}
            </button>
            <button type="button" onClick={toggleTheme} className="theme-toggle min-h-[40px] min-w-[40px] text-charcoal-light hover:text-forest" aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              <ThemeIcon theme={theme} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}