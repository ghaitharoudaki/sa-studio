import { Link } from 'react-router-dom'
import SEO from '../components/SEO'

export default function NotFound() {
  return (
    <section className="flex min-h-[55vh] flex-col items-center justify-center px-6 py-20 text-center">
      <SEO title="Page Not Found | SA Studio" description="The page you requested could not be found. Return to SA Studio to explore luxury textiles and wallpaper." />
      <p className="eyebrow">SA Studio</p>
      <h1 className="mt-5 font-serif text-6xl font-light text-charcoal">Page not found</h1>
      <p className="mt-5 max-w-md text-sm leading-7 text-charcoal-light">The page may have moved, but our collections are still here.</p>
      <Link to="/" className="primary-cta mt-8 inline-flex min-h-[46px] items-center px-7 py-3 text-[11px] uppercase tracking-[0.2em]">Back to Home</Link>
    </section>
  )
}
