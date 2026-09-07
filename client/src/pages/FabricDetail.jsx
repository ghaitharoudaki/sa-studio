import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchFabrics, WHATSAPP_BASE, MAPS_LINK } from '../data/fabrics'
import { useState, useEffect } from 'react'

export default function FabricDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [fabrics, setFabrics] = useState([])
  const [magnifier, setMagnifier] = useState(null)

  useEffect(() => {
    let ignore = false

    fetchFabrics().then((items) => {
      if (!ignore) setFabrics(items)
    })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      setScrollProgress(maxScroll > 0 ? Math.min(100, Math.round((scrollY / maxScroll) * 100)) : 0)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress)
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  const fabric = fabrics.find((f) => f.id === id)

  if (!fabric) {
    return (
      <div className="pt-[72px] min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="font-serif text-3xl font-light text-charcoal">
          Fabric not found
        </p>
        <Link
          to="/collections"
          className="text-[11px] tracking-[0.2em] uppercase text-forest hover:underline"
        >
          Back to Collections
        </Link>
      </div>
    )
  }

  const waMessage = encodeURIComponent(
    `Hello, I would like to request a quotation for the ${fabric.name} from the ${fabric.collection} collection at SA Studio.`
  )

  const related = fabrics
    .filter((f) => f.id !== fabric.id && f.category === fabric.category)
    .slice(0, 3)

  return (
    <div className="pt-[72px]">
      <div className="fixed top-[72px] left-0 right-0 h-1 bg-cream-dark z-40">
        <div
          className="h-full bg-forest transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back link */}
      <div className="px-8 lg:px-16 py-4 border-b border-cream-dark">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-charcoal-light hover:text-forest transition-colors min-h-[44px]"
        >
          <span className="text-base">←</span>
          Back to Collections
        </button>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Image - Fixed square aspect ratio */}
        <div className="relative bg-cream-light flex items-center justify-center p-6 sm:p-8 lg:p-12 min-h-0 lg:min-h-screen">
          {fabric.image ? (
            <div
              className="relative w-full max-w-[550px] aspect-square cursor-default lg:cursor-crosshair"
              style={{ touchAction: 'none' }}
              onPointerMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect()
                const lensSize = 221
                const zoom = 2.5
                const x = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width)
                const y = Math.min(Math.max(event.clientY - bounds.top, 0), bounds.height)
                const isSmallScreen = window.matchMedia('(max-width: 1023px)').matches

                setMagnifier({
                  left: isSmallScreen
                    ? Math.max(0, Math.min(x - lensSize / 2, Math.max(0, bounds.width - lensSize)))
                    : bounds.width + 16,
                  top: Math.max(0, Math.min(y - lensSize / 2, Math.max(0, bounds.height - lensSize))),
                  backgroundSize: `${bounds.width * zoom}px ${bounds.height * zoom}px`,
                  backgroundPosition: `${lensSize / 2 - x * zoom}px ${lensSize / 2 - y * zoom}px`,
                })
              }}
              onPointerDown={(event) => event.currentTarget.setPointerCapture?.(event.pointerId)}
              onPointerLeave={() => setMagnifier(null)}
            >
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={fabric.image}
                  alt={fabric.name}
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>
              {magnifier && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute z-10 h-[221px] w-[221px] border-2 border-white bg-no-repeat shadow-[0_4px_18px_rgba(0,0,0,0.28)]"
                  style={{
                    left: magnifier.left,
                    top: magnifier.top,
                    backgroundImage: `url(${fabric.image})`,
                    backgroundSize: magnifier.backgroundSize,
                    backgroundPosition: magnifier.backgroundPosition,
                  }}
                />
              )}
            </div>
          ) : (
            <div className={`w-full max-w-[550px] aspect-square ${fabric.texture}`} />
          )}
          <div className="absolute top-6 left-6 bg-charcoal/70 px-4 py-1.5">
            <span className="text-white text-[10px] tracking-[0.2em] uppercase">
              {fabric.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 lg:px-16 py-12 lg:py-16 flex flex-col justify-start lg:justify-center">
          <p className="eyebrow mb-2">
            {fabric.collection} Collection
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light text-charcoal leading-tight mb-1">
            {fabric.name}
          </h1>
          <p className="text-sm text-charcoal-light font-light mb-8 leading-relaxed">
            {fabric.description}
          </p>

          {/* Specs table */}
          <div className="mb-8 space-y-0">
            {Object.entries(fabric.specs).map(([key, value]) => (
              <div
                key={key}
                className="grid grid-cols-2 py-3 border-b border-cream-dark last:border-b-0"
              >
                <span className="text-[11px] tracking-[0.2em] uppercase text-charcoal-light font-light">
                  {key}
                </span>
                <span className="text-sm text-charcoal text-right font-light">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <a
              href={`${WHATSAPP_BASE}?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 border border-charcoal/20 text-charcoal hover:border-forest hover:text-forest"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Request a Quotation
            </a>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 border border-charcoal/20 text-charcoal hover:border-burgundy hover:text-burgundy"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Showroom
            </a>
          </div>
        </div>
      </div>

      {/* Related fabrics */}
      {related.length > 0 && (
        <div className="px-8 lg:px-16 py-16 border-t border-cream-dark">
          <h2 className="font-serif text-3xl font-light text-charcoal mb-8">
            More in <em className="text-forest">{fabric.category}</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-cream-dark">
            {related.map((f) => (
              <Link
                key={f.id}
                to={`/collections/${f.id}`}
                className="group block bg-cream overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden">
                  {f.image ? (
                    <img
                      src={f.image}
                      alt={f.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className={`w-full h-full ${f.texture} transition-transform duration-700 group-hover:scale-105`}
                    />
                  )}
                </div>
                <div className="p-4 border-b border-cream-dark">
                  <p className="eyebrow mb-1">
                    {f.category}
                  </p>
                  <h3 className="font-sans text-lg font-light text-charcoal">
                    {f.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quote modal */}

    </div>
  )
}