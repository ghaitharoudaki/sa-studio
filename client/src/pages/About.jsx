import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { WHATSAPP_BASE, MAPS_LINK } from '../data/fabrics'

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

export default function About() {
  const storyRef    = useFadeIn()
  const valuesRef   = useFadeIn()
  const contactRef  = useFadeIn()

  return (
    <div className="pt-[72px]">

      {/* Hero */}
      <div
        className="px-8 lg:px-20 py-24 lg:py-32"
        style={{ background: '#1C1C1A' }}
      >
        <p className="text-[11px] tracking-[0.3em] uppercase text-forest mb-6">
          Our Story
        </p>
        <h1 className="font-serif text-5xl lg:text-7xl font-light text-white leading-tight max-w-3xl">
          Samer Aroudaki<br />
          <em className="text-forest">& SA Studio</em>
        </h1>
        <div className="mt-8 w-16 h-px bg-forest" />
      </div>

      {/* Story section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-b border-cream-dark">
        <div
          ref={storyRef}
          className="opacity-0 translate-y-6 transition-all duration-700 px-8 lg:px-20 py-20 flex flex-col justify-center"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-forest mb-6">
            Est. 2005 · Damascus
          </p>
          <h2 className="font-serif text-4xl font-light text-charcoal leading-tight mb-6">
            Twenty One years of<br />
            <em className="text-burgundy">personal curation</em>
          </h2>
          <p className="text-sm leading-loose text-charcoal-light mb-5">
            Founded in Damascus in 2005, SA Studio has been the region's most
            trusted source for exceptional luxury textiles. Samer Aroudaki built
            the atelier on a philosophy of personal curation — every fabric and
            wallpaper in our showroom has been selected by hand.
          </p>
          <p className="text-sm leading-loose text-charcoal-light mb-5">
            Chosen not merely for beauty but for the conversation it begins when
            brought into a space. We travel to Milan, Paris, and Frankfurt so our
            clients don't have to — returning with the finest pieces from
            Europe's most distinguished textile houses.
          </p>
          <p className="text-sm leading-loose text-charcoal-light">
            Today SA Studio represents over twelve international maisons in Syria
            and the wider region, offering an unmatched breadth of fabric,
            wallpaper, and interior textile references to architects, interior
            designers, and private clients alike.
          </p>
        </div>

        {/* Visual block */}
        <div className="grid grid-rows-2 min-h-[400px]">
          <div className="tex-forest" />
          <div className="tex-burgundy" />
        </div>
      </section>

      {/* Values */}
      <section
        ref={valuesRef}
        className="opacity-0 translate-y-6 transition-all duration-700 grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-cream-dark"
      >
        {[
          {
            num: '01',
            title: 'Curation',
            body: 'Every reference in our collection has been personally sourced from the finest European textile houses. We travel to Milan, Paris, and Brussels so you don\'t have to.',
          },
          {
            num: '02',
            title: 'Expertise',
            body: 'With three decades of experience, our team offers deep knowledge of technical specifications, performance characteristics, and aesthetic suitability for every application.',
          },
          {
            num: '03',
            title: 'Service',
            body: 'From first consultation to final installation, SA Studio accompanies every client through the process — sampling, specification support, and project planning included.',
          },
        ].map(({ num, title, body }) => (
          <div key={num} className="bg-cream px-8 py-12">
            <p className="font-serif text-5xl font-light text-cream-dark leading-none mb-6">
              {num}
            </p>
            <p className="text-[11px] tracking-[0.2em] uppercase text-forest mb-4">
              {title}
            </p>
            <p className="text-sm leading-loose text-charcoal-light">{body}</p>
          </div>
        ))}
      </section>

      {/* Partners */}
      <section className="px-8 lg:px-20 py-16 border-b border-cream-dark">
        <p className="text-[11px] tracking-[0.3em] uppercase text-forest mb-8">
          Our Partners
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-cream-dark">
          {[
            'Armani Casa', 'Fine', 'Omexco', 'Arte',
            'Casamance', 'Texam', 'Roberto Cavali', 'Marburg',
          ].map((brand) => (
            <div
              key={brand}
              className="bg-cream px-6 py-8 flex items-center justify-center"
            >
              <span className="font-serif text-lg font-light text-charcoal-light italic">
                {brand}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        ref={contactRef}
        className="opacity-0 translate-y-6 transition-all duration-700 grid grid-cols-1 lg:grid-cols-2"
      >
        {/* Left */}
        <div
          className="px-8 lg:px-20 py-20 flex flex-col justify-center"
          style={{ background: '#2D4A3E' }}
        >
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-6">
            Visit Us
          </p>
          <h2 className="font-serif text-4xl font-light text-white leading-tight mb-8">
            Our Damascus<br />
            <em>Showroom</em>
          </h2>
          <div className="flex flex-col gap-6 text-sm text-white/60">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">
                Address
              </p>
              <p>Abou Rummaneh, Nizzar Kabbani St, Damascus, Syria</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">
                Hours
              </p>
              <p>Saturday – Thursday<br />11:00 AM – 7:00 PM</p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">
                WhatsApp
              </p>
              <p>+963 944 231 337</p>
            </div>
          </div>
          
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="mt-10 self-start inline-flex items-center gap-2 min-h-[44px] px-8 py-3 border border-white/30 text-white text-[11px] tracking-[0.2em] uppercase hover:border-white hover:bg-white/10 transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            View on Google Maps
          </a>
        </div>

        {/* Right */}
        <div className="px-8 lg:px-20 py-20 flex flex-col justify-center bg-cream-dark">
          <p className="text-[11px] tracking-[0.3em] uppercase text-forest mb-6">
            Get in Touch
          </p>
          <h2 className="font-serif text-4xl font-light text-charcoal leading-tight mb-4">
            Speak with<br />
            <em className="text-burgundy">Our Team</em>
          </h2>
          <p className="text-sm leading-loose text-charcoal-light mb-10">
            Whether you're an interior designer sourcing materials for a
            project, or a private client furnishing your home — we're here
            to help you find exactly the right fabric or wallpaper.
          </p>
          <div className="flex flex-col gap-3">
            
            <a
              href={WHATSAPP_BASE}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 min-h-[44px] px-8 py-3 bg-forest text-white text-[11px] tracking-[0.2em] uppercase hover:bg-forest-light transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
            <Link
              to="/collections"
              className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 border border-charcoal/20 text-charcoal text-[11px] tracking-[0.2em] uppercase hover:border-forest hover:text-forest transition-colors duration-200"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}