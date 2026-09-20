import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFabrics, getCategoryList } from '../data/fabrics'
import { useSite } from '../context/SiteContext'
import SEO from '../components/SEO'
import { useFavorites } from '../hooks/useFavorites'

const PAGE_SIZE = 12

function HeartIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  )
}

function FabricCard({ fabric }) {
  const { t } = useSite()
  const { isFavorite, toggleFavorite } = useFavorites()
  const detail = fabric.collection || fabric.specs?.Composition || 'SA Studio textile'

  return (
    <Link to={`/collections/${fabric.id}`} className="collections-product-card group">
      <div className="collections-product-image">
        {fabric.image ? (
          <img src={fabric.image} alt={`${fabric.name} ${fabric.collection || ''} textile`} loading="lazy" decoding="async" />
        ) : (
          <div className={`h-full w-full ${fabric.texture || 'tex-forest'}`} />
        )}
        <span className="collections-product-tag">
          {fabric.categories?.[0] || t('newArrival')}
        </span>
        <button type="button" className={`collections-favorite-button ${isFavorite(fabric.id) ? 'is-favorite' : ''}`} onClick={(event) => { event.preventDefault(); toggleFavorite(fabric.id) }} aria-label={isFavorite(fabric.id) ? `Remove ${fabric.name} from favorites` : `Add ${fabric.name} to favorites`}>
          <HeartIcon filled={isFavorite(fabric.id)} />
        </button>
      </div>
      <div className="collections-product-copy">
        <h2>{fabric.name}</h2>
        <p>{detail}</p>
      </div>
    </Link>
  )
}

export default function Collections() {
  const { t } = useSite()
  const [fabrics, setFabrics] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortMode, setSortMode] = useState('featured')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearchQuery(searchInput.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    let ignore = false
    fetchFabrics().then((items) => {
      if (!ignore) setFabrics(items)
    })
    return () => {
      ignore = true
    }
  }, [])

  const categories = getCategoryList(fabrics)
  const filtered = (activeCategory === 'All'
    ? fabrics
    : fabrics.filter((fabric) => fabric.categories?.includes(activeCategory))).filter((fabric) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return [fabric.name, fabric.collection, fabric.description].some((value) => value.toLowerCase().includes(query))
    })
  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sortMode === 'relevant' && searchQuery) {
      const score = (fabric) => [fabric.name, fabric.collection, fabric.description].reduce((total, value, index) => total + (value.toLowerCase().includes(searchQuery.toLowerCase()) ? 3 - index : 0), 0)
      return score(b) - score(a)
    }
    if (sortMode === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    if (sortMode === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0)
    return Number(b.featured) - Number(a.featured)
  }), [filtered, searchQuery, sortMode])
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const categoryLabel = (category) => {
    const key = category.toLowerCase() === 'all' ? 'allCategories' : category.toLowerCase()
    return ['wallpaper', 'upholstery', 'fabric'].includes(key) ? t(key) : category
  }

  const paginationRange = useMemo(() => {
    const totalNumbers = 5
    if (pageCount <= totalNumbers) {
      return Array.from({ length: pageCount }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(page - 1, 1)
    const rightSiblingIndex = Math.min(page + 1, pageCount)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < pageCount - 1

    if (!shouldShowLeftDots && shouldShowRightDots) {
      return [1, 2, 3, '...', pageCount]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      return [1, '...', pageCount - 2, pageCount - 1, pageCount]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      return [1, '...', page, '...', pageCount]
    }

    return []
  }, [pageCount, page])

  return (
    <div className="collections-page">
      <SEO title="Collections | SA Studio Luxury Fabrics" description="Explore SA Studio's considered edit of exceptional fabrics, upholstery, wallpaper and materials for interiors with character." image="https://sa-studio.sy/collections-bg.webp" />
      <div className="collections-page-background" aria-hidden="true" />
      <main className="collections-content-card">
        <section className="collections-intro">
          <p className="eyebrow">SA Studio / {t('collections')}</p>
          <h1>{t('theCollections')}</h1>
          <p className="collections-intro-description">{t('collectionIntro')}</p>
          <div className="collections-controls" aria-label={t('collections')}>
            <select
              value={activeCategory}
              onChange={(event) => { setActiveCategory(event.target.value); setPage(1) }}
              aria-label={t('collections')}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabel(category)}
                </option>
              ))}
            </select>
            <div className="collections-search">
              <span aria-hidden="true">⌕</span>
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={t('searchCollections')} aria-label={t('searchCollections')} />
            </div>
            <select value={searchQuery ? sortMode : 'featured'} onChange={(event) => setSortMode(event.target.value)} aria-label={t('sort')}>
              <option value="featured">{t('sortFeatured')}</option>
              <option value="newest">{t('sortNewest')}</option>
              <option value="oldest">{t('sortOldest')}</option>
              {searchQuery && <option value="relevant">{t('sortRelevant')}</option>}
            </select>
          </div>
        </section>

        <section className="collections-products" aria-label="Fabric collections">
          {sorted.length > 0 ? (
            paged.map((fabric) => <FabricCard key={fabric.id} fabric={fabric} />)
          ) : (
            <p className="collections-empty">{t('noCollections')}</p>
          )}
        </section>

        {pageCount > 1 && (
          <nav 
            className="collections-pagination flex items-center justify-center gap-1 py-6 px-2 w-full overflow-x-auto no-scrollbar" 
            aria-label="Collections pages"
          >
            {/* Previous Arrow */}
            <button 
              type="button" 
              disabled={page === 1} 
              onClick={() => setPage((current) => current - 1)}
              aria-label={t('previous')}
              className="w-7 h-7 flex items-center justify-center rounded border border-black/10 disabled:opacity-20 disabled:cursor-not-allowed shrink-0 hover:bg-black/5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M10 12L4 8l6-4" />
              </svg>
            </button>
            
            {/* Page Boxes */}
            {paginationRange.map((pageNumber, idx) =>
              pageNumber === '...' ? (
                <span key={`dots-${idx}`} className="px-1 text-[11px] opacity-40 shrink-0 select-none">
                  ...
                </span>
              ) : (
                <button
                  key={pageNumber}
                  type="button"
                  className={`w-7 h-7 text-[11px] font-medium rounded shrink-0 transition-colors flex items-center justify-center ${
                    page === pageNumber ? 'is-active bg-black text-white' : 'hover:bg-black/5 border border-transparent'
                  }`}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            )}

            {/* Next Arrow */}
            <button 
              type="button" 
              disabled={page === pageCount} 
              onClick={() => setPage((current) => current + 1)}
              aria-label={t('next')}
              className="w-7 h-7 flex items-center justify-center rounded border border-black/10 disabled:opacity-20 disabled:cursor-not-allowed shrink-0 hover:bg-black/5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M6 4l6 4-6 4" />
              </svg>
            </button>
          </nav>
        )}

        <section className="collections-closing-banner">
          <p className="eyebrow eyebrow-on-accent">{t('studioEdit')}</p>
          <h2>{t('materialsRoom')}</h2>
          <Link to="/contact" className="collections-closing-cta">
            {t('contactUs')}
          </Link>
        </section>
      </main>
    </div>
  )
}