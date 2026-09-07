import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'
import { useSite } from '../context/SiteContext'

export default function Footer() {
  const { t } = useSite()
  return (
    <footer
      className="px-6 lg:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
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

      <div className="flex gap-8">
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
      </div>
    </footer>
  )
}