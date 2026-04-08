import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/logo.jpg'

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const links = [
    { to: '/',            label: 'Home' },
    { to: '/collections', label: 'Collections' },
    { to: '/about',       label: 'About' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-sm' : ''
        }`}
        style={{
          background: 'rgba(240,239,237,0.93)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(45,74,62,0.15)',
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-16 h-[72px] flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="SA Studio"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
                  isActive(to)
                    ? 'text-forest'
                    : 'text-charcoal-light hover:text-forest'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            to="/about"
            className="hidden md:inline-flex items-center text-[11px] tracking-[0.18em] uppercase px-5 py-2.5 border border-forest text-forest hover:bg-forest hover:text-white transition-all duration-200 min-h-[44px]"
          >
            Request Quotation
          </Link>

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

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-cream flex flex-col px-6 pt-24 pb-10 gap-8 transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="font-serif text-4xl font-light text-charcoal border-b border-cream-dark pb-6 hover:text-forest transition-colors"
          >
            {label}
          </Link>
        ))}
        <Link
          to="/about"
          className="mt-auto text-center text-xs tracking-[0.2em] uppercase px-5 py-4 border border-forest text-forest min-h-[44px] flex items-center justify-center hover:bg-forest hover:text-white transition-all duration-200"
        >
          Request Quotation
        </Link>
      </div>
    </>
  )
}