import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'

export default function Footer() {
  return (
    <footer
      className="px-6 lg:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
      style={{ background: '#1C1C1A' }}
    >
      <img
        src={logo}
        alt="SA Studio"
        className="h-8 w-auto object-contain brightness-0 invert"
      />

      <p className="text-[11px] tracking-[0.15em] uppercase text-white/30">
        © {new Date().getFullYear()} SA Studio. All rights reserved.
      </p>

      <div className="flex gap-8">
        {[
          { to: '/',            label: 'Home' },
          { to: '/collections', label: 'Collections' },
          { to: '/about',       label: 'About' },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </footer>
  )
}