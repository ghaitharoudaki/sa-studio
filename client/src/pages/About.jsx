import { useCallback, useEffect, useState } from 'react'
import { WHATSAPP_BASE, SHOWROOMS } from '../data/fabrics'
import { useSite } from '../context/SiteContext'
import SEO from '../components/SEO'

function useReveal(threshold = 0.16) {
  const [element, setElement] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useCallback((node) => setElement(node), [])

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '40px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, threshold])

  return { elementRef: ref, isVisible }
}

const pillars = [
  { titleKey: 'curation', textKey: 'curationText' },
  { titleKey: 'precision', textKey: 'precisionText' },
  { titleKey: 'service', textKey: 'serviceText' },
]

const partners = ['Armani Casa', 'Casamance', 'Texam', 'Omexco', 'Fine', 'Arte', 'Marburg', 'Roberto Cavalli']

export default function About() {
  const { t } = useSite()
  const { elementRef: heroRef, isVisible: heroVisible } = useReveal(0.2)
  const { elementRef: quoteRef, isVisible: quoteVisible } = useReveal(0.18)
  const { elementRef: storyRef, isVisible: storyVisible } = useReveal(0.18)
  const { elementRef: valuesRef, isVisible: valuesVisible } = useReveal(0.18)
  const { elementRef: contactRef, isVisible: contactVisible } = useReveal(0.18)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (event) => {
      setPointer({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  const storyLabel = t?.('ourStory') || 'Our Story'

  return (
    <div className="overflow-hidden" style={{ background: 'var(--bg)' }}>
      <SEO title="Our Story | SA Studio Damascus" description="Meet SA Studio and discover two decades of personal curation, European textiles and design-led service in Damascus." />
      <section
        ref={heroRef}
        className={`relative px-6 md:px-10 lg:px-16 py-12 lg:py-16 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: 'radial-gradient(circle at 20% 20%, rgba(31, 61, 46, 0.16), transparent 30%), radial-gradient(circle at 80% 30%, rgba(107, 42, 42, 0.12), transparent 35%)',
            transform: `translate(${pointer.x * 0.015}px, ${pointer.y * 0.015}px)`,
            transition: 'transform 220ms ease-out',
          }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <p
              className="mb-6 text-[11px] uppercase tracking-[0.28em]"
              style={{ color: 'var(--green)' }}
            >
              {storyLabel} · <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>Damascus · Est. 2005</span>
            </p>

            <h1
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
              }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem]"
            >
              {t('aboutName')}
            </h1>

            <div className="mt-4 flex items-center gap-5">
              <span className="block h-px w-20" style={{ background: 'var(--burgundy)' }} />
              <span
                style={{
                  color: 'var(--burgundy)',
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(2.1rem, 4vw, 4rem)',
                  lineHeight: 1,
                }}
              >
                {t('aboutAndStudio')}
              </span>
            </div>

            <p
              className="mt-7 max-w-lg text-base leading-8"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('aboutYears')}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={SHOWROOMS[0].mapsLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border px-6 text-[11px] uppercase tracking-[0.18em] transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  borderColor: 'var(--green)',
                  color: 'var(--green)',
                  background: 'transparent',
                }}
              >
                {t('visitShowroom')}
              </a>

              <a
                href={WHATSAPP_BASE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full px-6 text-[11px] uppercase tracking-[0.18em] transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'var(--burgundy)',
                  color: 'var(--text-on-accent)',
                }}
              >
                {t('whatsapp')}
              </a>
            </div>
          </div>

          <div className="relative h-[440px] w-full overflow-hidden rounded-[28px] border" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, rgba(31, 61, 46, 0.08), rgba(107, 42, 42, 0.12))' }}>
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(28, 24, 21, 0.08), rgba(28, 24, 21, 0.34)), radial-gradient(circle at top left, rgba(255,255,255,0.5), transparent 32%)',
              }}
            />
            <div className="absolute inset-x-10 bottom-10 top-10 rounded-[22px] border border-white/40 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.4),_transparent_28%),linear-gradient(160deg,_rgba(31,61,46,0.9)_0%,_rgba(31,61,46,0.35)_42%,_rgba(107,42,42,0.3)_100%)] shadow-[0_35px_70px_rgba(28,24,21,0.12)]" />
            <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full border border-white/30 bg-white/8 backdrop-blur-[2px]" />
            <div className="absolute right-10 top-10 h-44 w-44 rounded-full border border-white/20 bg-white/8 backdrop-blur-[2px]" />
            <div className="absolute bottom-20 right-16 h-48 w-48 rounded-full border border-white/25 bg-[rgba(250,248,243,0.14)]" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/5 px-6 py-4 text-[10px] uppercase tracking-[0.26em] text-white backdrop-blur-sm" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
              Atelier Damascus
            </div>
          </div>
        </div>
      </section>

      <section
        ref={quoteRef}
        className={`px-6 py-16 md:py-24 transition-all duration-700 ${quoteVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ background: 'var(--bg-elevated)' }}
      >
        <div className="mx-auto max-w-5xl text-center">
          <p
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
            className="text-4xl md:text-6xl"
          >
            {t('aboutQuote')}
          </p>

          <p className="mt-8 text-[11px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-secondary)' }}>
            {t('aboutFounder')}
          </p>
        </div>
      </section>

      <section
        ref={storyRef}
        className={`mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-24 transition-all duration-700 ${storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="relative h-[520px] overflow-hidden rounded-[30px] border" style={{ borderColor: 'var(--border)', background: 'linear-gradient(150deg, rgba(31, 61, 46, 0.14), rgba(107, 42, 42, 0.12))' }}>
          <div className="absolute inset-6 rounded-[24px] border border-white/40 bg-[linear-gradient(140deg,_rgba(255,255,255,0.22),_rgba(31,61,46,0.28)_38%,_rgba(107,42,42,0.22))]" />
          <div className="absolute bottom-10 left-10 h-36 w-36 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm" />
          <div className="absolute right-10 top-10 h-20 w-20 rounded-full border border-white/25 bg-white/10" />
          <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full border border-white/20 bg-[rgba(250,248,243,0.12)]" />
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: 'var(--green)' }}>
            <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>Est. 2005 · Damascus</span>
          </p>

          <h2
            className="mt-6 text-4xl md:text-5xl"
            style={{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
            }}
          >
            {t('aboutStoryHeading')}
          </h2>

          <div className="mt-8 space-y-5 text-base leading-8" style={{ color: 'var(--text-secondary)' }}>
            <p>
              {t('aboutStoryOne')}
            </p>
            <p>
              {t('aboutStoryTwo')}
            </p>
            <p>
              {t('aboutStoryThree')}
            </p>
          </div>
        </div>
      </section>

      <section
        ref={valuesRef}
        className={`px-6 py-16 lg:px-10 lg:py-24 transition-all duration-700 ${valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ background: 'var(--bg-elevated)' }}
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: 'var(--green)' }}>
            {t('aboutFoundation')}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((item, index) => (
              <div
                key={item.title}
                className="group rounded-[26px] border p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--bg)',
                  borderColor: 'var(--border)',
                  boxShadow: index === 1 ? '0 20px 50px rgba(31, 61, 46, 0.08)' : 'none',
                }}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border text-lg" style={{ borderColor: 'var(--border)', color: 'var(--burgundy)' }}>
                  {index + 1}
                </div>
                <h3
                  className="text-3xl"
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 400,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                  }}
                >
                  {t(item.titleKey)}
                </h3>
                <p className="mt-5 text-base leading-8" style={{ color: 'var(--text-secondary)' }}>
                  {t(item.textKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10 lg:py-24" style={{ background: 'var(--bg)' }}>
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.28em]" style={{ color: 'var(--green)' }}>
            {t('trustedPartners')}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {partners.map((brand) => (
              <div
                key={brand}
                className="flex min-h-[120px] items-center justify-center border text-center"
                style={{
                  borderColor: 'var(--border)',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontStyle: 'italic',
                  letterSpacing: '-0.03em',
                }}
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={contactRef}
        className={`grid gap-0 lg:grid-cols-2 transition-all duration-700 ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="relative min-h-[420px] overflow-hidden lg:min-h-[620px]" style={{ background: 'linear-gradient(135deg, rgba(31, 61, 46, 0.2), rgba(107, 42, 42, 0.2))' }}>
          <div className="absolute inset-0" style={{ transform: `translate(${pointer.x * 0.02}px, ${pointer.y * 0.02}px)`, transition: 'transform 220ms ease-out' }}>
            <div className="absolute inset-6 rounded-[30px] border border-white/30 bg-[linear-gradient(150deg,_rgba(255,255,255,0.16),_rgba(31,61,46,0.38)_45%,_rgba(107,42,42,0.30))]" />
            <div className="absolute left-10 top-10 h-28 w-28 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm" />
            <div className="absolute bottom-12 right-12 h-52 w-52 rounded-full border border-white/25 bg-white/10" />
          </div>
        </div>

        <div className="flex items-center px-6 py-12 md:px-10 lg:px-14" style={{ background: 'var(--burgundy)' }}>
          <div className="max-w-xl text-white">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/75">{t('visitOurShowroom')}</p>

            <h2
              className="mt-6 text-4xl md:text-5xl"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
              }}
            >
              {t('damascusShowroomHeading')}
            </h2>

            <div className="mt-10 space-y-8 text-base text-white/80">
              {SHOWROOMS.map((showroom) => (
                <div key={showroom.id}>
                  <h3 className="text-lg text-white" dir="ltr" style={{ unicodeBidi: 'isolate' }}>{showroom.name}</h3>
                  <p className="mt-2" dir="ltr" style={{ unicodeBidi: 'isolate' }}>{showroom.address}</p>
                  <p className="mt-2 text-sm text-white/70">{t('showroomHours')} · <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{showroom.whatsapp}</span></p>
                  <a href={showroom.mapsLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-[44px] items-center rounded-full border border-white/40 px-5 text-[11px] uppercase tracking-[0.18em] text-white transition-all duration-200 hover:border-white hover:bg-white/8">
                    {t('viewGoogleMaps')}
                  </a>
                </div>
              ))}
            </div>

            <a
              href={WHATSAPP_BASE}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-6 text-[11px] uppercase tracking-[0.18em] transition-all duration-200 hover:-translate-y-0.5"
              style={{ color: 'var(--burgundy)' }}
            >
              {t('messageUs')}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
