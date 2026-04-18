import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { fabrics, PARTNER_BRANDS, WHATSAPP_BASE } from '../data/fabrics'

function Marquee() {
  const doubled = [...PARTNER_BRANDS, ...PARTNER_BRANDS]
  return (
    <div
      className="overflow-hidden py-4 border-y"
      style={{
        background: '#1C1C1A',
        borderColor: 'rgba(45,74,62,0.3)',
      }}
    >
      <div className="flex gap-16 animate-marquee w-max">
        {doubled.map((brand, i) => (
          <span key={i} className="flex items-center gap-16">
            <span className="font-serif text-base italic text-white/40 whitespace-nowrap">
              {brand}
            </span>
            <span className="text-forest text-xs">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function FabricCard({ fabric }) {
  return (
    <Link
      to={`/collections/${fabric.id}`}
      className="group block overflow-hidden bg-cream-dark"
    >
      <div className="relative h-72 overflow-hidden">
        {fabric.image ? (
          <img
            src={fabric.image}
            alt={fabric.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full ${fabric.texture} transition-transform duration-700 group-hover:scale-105`}
          />
        )}
        <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-[11px] tracking-[0.25em] uppercase border border-white/60 px-5 py-2.5">
            View Details
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-[10px] tracking-[0.25em] uppercase text-forest mb-1">
          {fabric.category}
        </p>
        <h3 className="font-serif text-xl font-light text-charcoal">
          {fabric.name}
        </h3>
        <p className="text-xs text-charcoal-light mt-0.5">
          {fabric.collection} Collection
        </p>
      </div>
    </Link>
  )
}

function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0')
          el.classList.remove('opacity-0', 'translate-y-6')
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

export default function Home() {
  const aboutRef = useFadeIn()
  const statsRef = useFadeIn()
  const previewRef = useFadeIn()
  const heroRef = useRef(null)
  const [heroPos, setHeroPos] = useState({ x: 50, y: 50 })

  const featured = fabrics.slice(0, 3)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    hero.style.setProperty('--hero-bg-x', `${heroPos.x}%`)
    hero.style.setProperty('--hero-bg-y', `${heroPos.y}%`)
  }, [heroPos])

  const handleHeroMove = (event) => {
    const hero = heroRef.current
    if (!hero) return
    const rect = hero.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setHeroPos({ x: Math.min(70, Math.max(30, x)), y: Math.min(70, Math.max(30, y)) })
  }

  const resetHero = () => setHeroPos({ x: 50, y: 50 })

  return (
    <div className="pt-[72px]">

      <section
        ref={heroRef}
        className="relative h-[calc(100vh-72px)] overflow-hidden home-hero-wallpaper"
        onMouseMove={handleHeroMove}
        onMouseLeave={resetHero}
        onMouseEnter={handleHeroMove}
      >
        <div className="interactive-hero-bg" />
        <div className="absolute inset-0 flex items-center justify-center px-8 lg:px-20">
          <div className="text-center max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-cream shadow-sm backdrop-blur-sm">
              Damascus · Est. 2005
            </div>
            <h1 className="font-serif text-5xl lg:text-7xl font-light leading-tight text-white mb-8">
              Luxury Textiles, Crafted for the Senses
            </h1>
            <p className="text-base leading-loose text-slate-300 max-w-2xl mx-auto mb-10">
              Discover unparalleled fabrics that blend Damascus heritage with contemporary elegance, where every thread tells a story of craftsmanship and refinement.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/collections"
                className="inline-flex items-center min-h-[50px] px-10 py-4 rounded-full bg-forest text-white text-[11px] tracking-[0.2em] uppercase hover:bg-forest-light transition-all duration-200 shadow-deep"
              >
                Explore Collections
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center min-h-[50px] px-10 py-4 rounded-full border border-white/20 bg-white/10 text-white text-[11px] tracking-[0.2em] uppercase hover:bg-white/15 hover:border-forest hover:text-white transition-all duration-200"
              >
                View Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* ABOUT STRIP */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-cream-dark">
        <div
          ref={aboutRef}
          className="opacity-0 translate-y-6 transition-all duration-700 px-8 lg:px-20 py-20 flex flex-col justify-center"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-forest mb-6">
            The Atelier
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light leading-tight text-charcoal mb-6">
            Three decades of<br />
            <em className="text-burgundy">curatorial excellence</em>
          </h2>
          <p className="text-sm leading-loose text-charcoal-light mb-8 max-w-md">
            SA Studio was founded with a singular vision: to bring the world's
            most distinguished textiles to the discerning interiors of Damascus
            and the wider region. Each collection is personally selected for its
            technical mastery and aesthetic distinction.
          </p>
          <Link
            to="/about"
            className="self-start inline-flex items-center min-h-[44px] px-8 py-3 border border-charcoal/30 text-charcoal text-[11px] tracking-[0.2em] uppercase hover:border-forest hover:text-forest transition-colors duration-200"
          >
            Learn More
          </Link>
        </div>

        <div
          ref={statsRef}
          className="opacity-0 translate-y-6 transition-all duration-700 delay-200 bg-cream-dark grid grid-cols-2"
        >
          {[
            { num: '20+',  label: 'Years of excellence' },
            { num: '500+', label: 'Fabric references' },
            { num: '2',    label: 'Damascus showroom' },
          ].map(({ num, label }) => (
            <div
              key={label}
              className="p-10 border-b border-r flex flex-col justify-center"
              style={{ borderColor: '#E3E1DE' }}
            >
              <p className="font-serif text-5xl font-light text-charcoal leading-none mb-2">
                {num}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal-light">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 lg:px-16 py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-[11px] tracking-[0.35em] uppercase text-forest mb-4">Material Lab</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-charcoal mb-4">Touch, compare, and decide with confidence</h2>
          <p className="text-sm text-charcoal-light max-w-2xl mx-auto">Interactive previews and carefully curated material stories let your next design decision feel elevated before you even visit the showroom.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((fabric) => (
            <article
              key={fabric.id}
              className="group relative overflow-hidden rounded-[32px] bg-white shadow-deep border border-cream-dark transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-72 overflow-hidden">
                {fabric.image ? (
                  <img
                    src={fabric.image}
                    alt={fabric.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`w-full h-full ${fabric.texture} transition-transform duration-700 group-hover:scale-105`}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 text-white opacity-90">
                  <p className="text-[10px] uppercase tracking-[0.25em] mb-2">{fabric.collection}</p>
                  <h3 className="font-serif text-2xl font-light">{fabric.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(fabric.specs)
                    .slice(0, 3)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="rounded-full border border-cream-dark px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-charcoal-light"
                      >
                        {key}
                      </span>
                    ))}
                </div>
                <p className="text-sm text-charcoal-light mb-6">{fabric.description}</p>
                <Link
                  to={`/collections/${fabric.id}`}
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-forest"
                >
                  Explore fabric
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section
        className="px-8 lg:px-20 py-16 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ background: '#2D4A3E' }}
      >
        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-2">
            Get in touch
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-white">
            Speak directly with <em>Our Team</em>
          </h2>
        </div>
        
        <a
          href={WHATSAPP_BASE}
          target="_blank"
          rel="noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-3 min-h-[44px] px-8 py-3 bg-white text-forest text-[11px] tracking-[0.2em] uppercase hover:bg-cream transition-colors duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat on WhatsApp
        </a>
      </section>

    </div>
  )
}