import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { WHATSAPP_BASE } from '../data/fabrics'
import { useSite } from '../context/SiteContext'
import { getSpecTranslationKey } from '../lib/i18nHelpers'
import SEO from '../components/SEO'
import HeroCarousel from '../components/HeroCarousel'

function FeaturedSkeleton() {
  return (
    <div className="fabric-tile border border-cream-dark" aria-hidden="true">
      <div className="fabric-tile-media skeleton" />
      <div className="fabric-tile-body">
        <div className="skeleton skeleton-line w-1/3" />
        <div className="skeleton skeleton-line h-6 w-2/3" />
        <div className="skeleton skeleton-line w-full" />
        <div className="skeleton skeleton-line w-5/6" />
      </div>
    </div>
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
  const { t, fabrics, isLoadingFabrics } = useSite()
  const aboutRef = useFadeIn()
  const statsRef = useFadeIn()
  const featuredFabrics = fabrics.filter((item) => item.featured)
  const featured = (featuredFabrics.length > 0 ? featuredFabrics : fabrics).slice(0, 3)

  return (
    <div>
      <SEO title="Luxury Textiles & Wallpaper in Damascus | SA Studio" description="Discover SA Studio's curated fabrics and wallpaper for distinctive interiors in Damascus and the wider region." image="https://sa-studio.sy/hero-texture.webp" />

      {/* HERO CAROUSEL */}
      <HeroCarousel />

      {/* ATELIER SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-cream-dark">
        <div
          ref={aboutRef}
          className="opacity-0 translate-y-6 transition-all duration-700 px-8 lg:px-20 py-20 flex flex-col justify-center"
        >
          <p className="eyebrow mb-6">
            {t('atelier')}
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light leading-tight text-charcoal mb-6">
            {t('atelierHeading')}
          </h2>
          <p className="text-sm leading-loose text-charcoal-light mb-8 max-w-md">
            {t('homeAtelierDescription')}
          </p>
          <Link
            to="/about"
            className="self-start inline-flex items-center min-h-[44px] px-8 py-3 border border-charcoal/30 text-charcoal text-[11px] tracking-[0.2em] uppercase hover:border-forest hover:text-forest transition-colors duration-200"
          >
            {t('learnMore')}
          </Link>
        </div>

        <div
          ref={statsRef}
          className="opacity-0 translate-y-6 transition-all duration-700 delay-200 bg-cream-dark grid grid-cols-2"
        >
          {[
            { num: '20+', label: t('yearsExcellence') || 'Years of Excellence' },
            { num: '10,000+', label: t('fabricReferences') || 'Fabric References', accent: 'burgundy' },
            { num: '2', label: t('damascusLocations') },
            { num: t('curatedGlobally'), label: t('curatedGlobally'), accent: 'forest' },
          ].map(({ num, label, accent }) => (
            <div
              key={label}
              className="p-10 border-b border-r flex flex-col justify-center"
              style={{
                borderColor: 'var(--border)',
                background:
                  accent === 'burgundy'
                    ? 'var(--bg-accent-block)'
                    : accent === 'forest'
                    ? 'var(--green)'
                    : undefined,
              }}
            >
              <p
                className={`font-serif text-5xl font-light leading-none mb-2 ${
                  accent ? 'text-white' : 'text-charcoal'
                }`}
              >
                {num}
              </p>
              <p
                className={`text-[10px] tracking-[0.2em] uppercase ${
                  accent ? 'text-white/80' : 'text-charcoal-light'
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MATERIAL LAB */}
      <section className="px-8 lg:px-16 py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="eyebrow mb-4">{t('materialLab')}</p>
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-charcoal mb-4">{t('materialTitle')}</h2>
          <p className="text-sm text-charcoal-light max-w-2xl mx-auto">{t('materialDescription')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingFabrics && [0, 1, 2].map((i) => <FeaturedSkeleton key={i} />)}
          {!isLoadingFabrics && featured.map((fabric) => (
            <Link
              key={fabric.id}
              to={`/collections/${fabric.id}`}
              className="fabric-tile group border border-cream-dark transition-colors duration-300 hover:border-forest"
            >
              <div className="fabric-tile-media">
                {fabric.image ? (
                  <img
                    src={fabric.image}
                    alt={`${fabric.name} ${fabric.collection || ''} textile`}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className={`w-full h-full ${fabric.texture}`} />
                )}
              </div>
              <div className="fabric-tile-body">
                <p className="eyebrow mb-2">{fabric.collection}</p>
                <h3 className="mb-4">{fabric.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(fabric.specs || {})
                    .slice(0, 3)
                    .map(([key]) => (
                      <span
                        key={key}
                        className="rounded-full border border-cream-dark px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-charcoal-light"
                      >
                        {getSpecTranslationKey(key) ? t(getSpecTranslationKey(key)) : key}
                      </span>
                    ))}
                </div>
                <p className="text-sm leading-relaxed text-charcoal-light mb-6 line-clamp-3">{fabric.description}</p>
                <span className="mt-auto font-sans inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-forest">
                  {t('exploreFabric')}
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHATSAPP CTA */}
      <section
        className="px-8 lg:px-20 py-16 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ background: 'var(--bg-accent-block)' }}
      >
        <div>
          <p className="eyebrow eyebrow-on-accent mb-2">
            {t('getInTouch')}
          </p>
          <h2 className="font-serif text-3xl lg:text-4xl font-light text-white">
            {t('speakTeam')}
          </h2>
        </div>
        
        <a
          href={WHATSAPP_BASE}
          target="_blank"
          rel="noreferrer"
          className="primary-cta flex-shrink-0 inline-flex items-center gap-3 min-h-[44px] px-8 py-3 text-[11px] tracking-[0.2em] uppercase transition-colors duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {t('chatWhatsApp')}
        </a>
      </section>
    </div>
  )
}