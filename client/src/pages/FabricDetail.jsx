import { useParams, Link, useNavigate } from 'react-router-dom'
import { WHATSAPP_BASE, SHOWROOMS, fetchFabricColors } from '../data/fabrics'
import { useState, useEffect } from 'react'
import { useSite } from '../context/SiteContext'
import SEO from '../components/SEO'
import { useFavorites } from '../hooks/useFavorites'

function HeartIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  )
}

function UsageIcon({ category }) {
  if (category === 'Upholstery') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8 fill-none stroke-current stroke-[1.5]">
        <path d="M9 25v-4a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v4" />
        <path d="M6 26a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v9H6v-9Z" />
        <path d="M10 35v4M38 35v4M12 27h24" />
      </svg>
    )
  }

  if (category === 'Curtains') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8 fill-none stroke-current stroke-[1.5]">
        <path d="M8 9h32M12 9v29M36 9v29M12 15c3 2 3 5 0 8s-3 6 0 9M36 15c-3 2-3 5 0 8s3 6 0 9" />
        <path d="M8 39h32" />
      </svg>
    )
  }

  if (category === 'Wallpaper') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8 fill-none stroke-current stroke-[1.5]">
        <path d="M8 10h32v28H8zM14 10v28M34 10v28" />
        <path d="m14 18 5-4 5 4 5-4 5 4M14 28l5-4 5 4 5-4 5 4" />
      </svg>
    )
  }

  if (category === 'Borders') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8 fill-none stroke-current stroke-[1.5]">
        <path d="M6 14h36M6 34h36" />
        <path d="M10 14v20M16 14v20M28 14v20M34 14v20M38 14v20M38 14v20" strokeDasharray="2 4" />
      </svg>
    )
  }

  if (category === 'Outdoor Upholstery') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8 fill-none stroke-current stroke-[1.5]">
        <path d="M24 6v4M24 8c9 0 16 5 16 12H8c0-7 7-12 16-12Z" />
        <path d="M24 20v18M18 38h12M20 44h8" />
      </svg>
    )
  }

  return null
}

export default function FabricDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [magnifier, setMagnifier] = useState(null)
  const [activeImage, setActiveImage] = useState('')
  const [colors, setColors] = useState([])
  const [activeColor, setActiveColor] = useState(null)
  const { t, fabrics, isLoadingFabrics } = useSite()
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    if (!id) return
    fetchFabricColors(id).then((rows) => {
      setColors(rows)
      if (rows.length) {
        setActiveColor(rows[0])
        setActiveImage(rows[0].image)
      }
    })
  }, [id])

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
  const imageUrls = fabric?.images?.length ? fabric.images : (fabric?.image ? [fabric.image] : [])
  const displayedImage = activeImage || imageUrls[0]

  const handleBack = () => {
    // Explicitly reset search params and state back to root collections page 1
    navigate('/collections', { replace: true, state: { resetPage: true } })
  }

  if (isLoadingFabrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-serif text-xl font-light text-charcoal opacity-60">
          {t('loadingFabrics')}
        </p>
      </div>
    )
  }

  if (!fabric) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="font-serif text-3xl font-light text-charcoal">
          {t('fabricNotFound')}
        </p>
        <button
          onClick={handleBack}
          className="text-[11px] tracking-[0.2em] uppercase text-forest hover:underline"
        >
          {t('backCollections')}
        </button>
      </div>
    )
  }

  const detailTitle = `${fabric.name} | ${fabric.collection || 'SA Studio Collection'}`
  const detailDescription = fabric.description || `Explore ${fabric.name}, a curated SA Studio textile from Damascus.`

  const waMessage = encodeURIComponent(
    `Hello, I would like to request a quotation for the ${fabric.name} from the ${fabric.collection} collection at SA Studio.`
  )

  const related = fabrics
    .filter((f) => f.id !== fabric.id && f.categories?.some((c) => fabric.categories?.includes(c)))
    .slice(0, 3)

  return (
    <div>
      <SEO title={detailTitle} description={detailDescription} image={fabric.image || undefined} />
      <div className="fixed top-[72px] left-0 right-0 h-1 bg-cream-dark z-40">
        <div
          className="h-full bg-forest transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back link */}
      <div className="px-8 lg:px-16 py-4 border-b border-cream-dark">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-charcoal-light hover:text-forest transition-colors min-h-[44px]"
        >
          <span className="text-base">←</span>
          {t('backCollections')}
        </button>
      </div>

      {/* Main layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image column wrapper */}
        <div>
        {/* Image - Fixed square aspect ratio */}
        <div className="relative bg-cream-light flex items-center justify-center p-6 sm:p-8 lg:p-12">          {displayedImage ? (
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
                  src={displayedImage}
                  alt={`${fabric.name} ${fabric.collection || ''} textile detail`}
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
                    backgroundImage: `url(${displayedImage})`,
                    backgroundSize: magnifier.backgroundSize,
                    backgroundPosition: magnifier.backgroundPosition,
                  }}
                />
              )}
            </div>
          ) : (
            <div className={`w-full max-w-[550px] aspect-square ${fabric.texture}`} />
          )}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-6 left-6 right-6 flex gap-2 overflow-x-auto">
              {imageUrls.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => { setActiveImage(image); setMagnifier(null) }}
                  className={`shrink-0 border-2 ${image === displayedImage ? 'border-forest' : 'border-white/70'}`}
                >
                  <img src={image} alt={`${fabric.name} photo ${index + 1}`} className="h-16 w-16 object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="absolute top-6 left-6 bg-charcoal/70 px-4 py-1.5">
            <span className="text-white text-[10px] tracking-[0.2em] uppercase">
              {fabric.categories?.join(' / ')}
            </span>
          </div>
        </div>
                {colors.length > 0 && (
          <div className="flex justify-center gap-3 py-4 px-4 bg-cream-light overflow-x-auto no-scrollbar">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => { setActiveColor(color); setActiveImage(color.image); setMagnifier(null) }}
                title={color.color_name}
                aria-label={`View ${color.color_name} colorway`}
                className={`h-10 w-10 rounded-full border-2 overflow-hidden shrink-0 ${activeColor?.id === color.id ? 'border-forest' : 'border-charcoal/20'}`}
              >
                <img src={color.image} alt={color.color_name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        </div>

        {/* Content */}
        <div className="px-8 lg:px-16 py-12 lg:py-16 flex flex-col justify-start lg:justify-center">
          <p className="eyebrow mb-2">
            {fabric.collection} {t('collection')}
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-charcoal leading-tight mb-1">
            {fabric.name}
          </h1>
          {fabric.reference && (
            <p className="text-xs text-charcoal-light font-medium mb-3">
              Ref: {fabric.reference}
            </p>
          )}
          {activeColor && (
            <p className="text-xs text-charcoal-light font-medium mb-3">Color: {activeColor.color_name}</p>
          )}
          <button type="button" onClick={() => toggleFavorite(fabric.id)} className={`fabric-detail-favorite ${isFavorite(fabric.id) ? 'is-favorite' : ''}`} aria-label={isFavorite(fabric.id) ? `Remove ${fabric.name} from favorites` : `Add ${fabric.name} to favorites`}>
            <HeartIcon filled={isFavorite(fabric.id)} />
            {isFavorite(fabric.id) ? t('removeFavorite') : t('addFavorite')}
          </button>
          <p className="text-sm text-charcoal-light font-medium mb-8 leading-relaxed">
            {fabric.description}
          </p>

          {/* Specs table */}
          {fabric.specs && (
            <div className="mb-8 space-y-0">
              {Object.entries(fabric.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-2 py-3 border-b border-cream-dark last:border-b-0"
                >
                  <span className="text-[11px] tracking-[0.2em] uppercase text-charcoal-light font-semibold">
                    {key}
                  </span>
                  <span className="text-sm text-charcoal text-right font-semibold">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {fabric.categories?.length > 0 && (
            <div className="mb-8 border-b border-cream-dark">
              <div className="grid grid-cols-2 items-start py-3">
                <span className="text-[11px] tracking-[0.2em] uppercase text-charcoal-light font-semibold">
                  Usage
                </span>
                <div className="flex flex-col items-end gap-3">
                  {fabric.categories.map((cat) => (
                    <span key={cat} className="flex items-center justify-end gap-3 text-sm text-charcoal font-semibold">
                      <UsageIcon category={cat} />
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <a
              href={`${WHATSAPP_BASE}?text=${waMessage}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-200 bg-forest text-white hover:opacity-90"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t('requestFabricQuote')}
            </a>

            {SHOWROOMS?.[0]?.mapsLink && (
              <a
                href={SHOWROOMS[0].mapsLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-200 bg-burgundy text-white hover:opacity-90"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                {t('showroomLabel')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Related fabrics */}
      {related.length > 0 && (
        <div className="px-8 lg:px-16 py-16 border-t border-cream-dark">
          <h2 className="font-serif text-3xl font-light text-charcoal mb-8">
            {t('moreInCollection')} <em className="text-forest">{fabric.categories?.join(' / ')}</em>
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
                      alt={`${f.name} ${f.collection || ''} textile`}
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
                    {f.categories?.join(' / ')}
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
    </div>
  )
}