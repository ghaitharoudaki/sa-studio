import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams, useLocation } from 'react-router-dom'
import { getCategoryList, getWebpSource } from '../data/fabrics'
import { useSite } from '../context/SiteContext'
import { getCategoryTranslationKey } from '../lib/i18nHelpers'
import SEO from '../components/SEO'
import { useFavorites } from '../hooks/useFavorites'

const PAGE_SIZE = 12

const normalizeSearchText = (value = '') => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/\s+/g, ' ')

const getSearchFields = (fabric) => [
  fabric.name,
  fabric.collection,
  fabric.description,
  ...(fabric.categories || []),
  ...Object.values(fabric.specs || {}),
].map(normalizeSearchText).filter(Boolean)

function HeartIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  )
}

function FabricCard({ fabric, compareIds, onToggleCompare }) {
  const { t } = useSite()
  const { isFavorite, toggleFavorite } = useFavorites()
  const location = useLocation()
  const detail = fabric.collection || fabric.specs?.Composition || 'SA Studio textile'

  return (
    <article className="collections-product-card group">
      <div className={`collections-product-image ${fabric.texture || 'tex-forest'}`}>
        <Link to={{ pathname: `/collections/${fabric.id}`, search: location.search }} aria-label={`View ${fabric.name}`}>
          {fabric.image ? (
            <picture>
              {getWebpSource(fabric.image) && <source srcSet={getWebpSource(fabric.image)} type="image/webp" />}
              <img
                src={fabric.image}
                alt={`${fabric.name} ${fabric.collection || ''} textile`}
                loading="lazy"
                decoding="async"
              />
            </picture>
          ) : (
            <div className={`h-full w-full ${fabric.texture || 'tex-forest'}`} />
          )}
        </Link>
        <span className="collections-product-tag">
          {getCategoryTranslationKey(fabric.categories?.[0]) ? t(getCategoryTranslationKey(fabric.categories[0])) : fabric.categories?.[0] || t('newArrival')}
        </span>
        <button 
          type="button" 
          className={`collections-favorite-button ${isFavorite(fabric.id) ? 'is-favorite' : ''}`} 
          onClick={() => toggleFavorite(fabric.id)}
          aria-label={isFavorite(fabric.id) ? `Remove ${fabric.name} from favorites` : `Add ${fabric.name} to favorites`}
        >
          <HeartIcon filled={isFavorite(fabric.id)} />
        </button>
        <button
          type="button"
          className={`collections-compare-button ${compareIds.includes(fabric.id) ? 'is-selected' : ''}`}
          onClick={() => onToggleCompare(fabric.id)}
          aria-pressed={compareIds.includes(fabric.id)}
          aria-label={`${compareIds.includes(fabric.id) ? t('compareRemoveFrom') : t('compareAdd')}: ${fabric.name}`}
          title={compareIds.includes(fabric.id) ? t('compareRemoveFrom') : t('compareAdd')}
        >
          {compareIds.includes(fabric.id) ? t('selected') : t('compare')}
        </button>
      </div>
      <Link to={{ pathname: `/collections/${fabric.id}`, search: location.search }} className="collections-product-copy">
        <h2>{fabric.name}</h2>
        <p>{detail}</p>
      </Link>
    </article>
  )
}

function ComparisonDialog({ fabrics, onClose, onRemove }) {
  const { t } = useSite()
  const [showDetails, setShowDetails] = useState(false)
  const specKeys = [...new Set(fabrics.flatMap((fabric) => Object.keys(fabric.specs || {})))]
  const detailRows = [
    { label: t('compareDescription'), values: fabrics.map((fabric) => fabric.description || '—') },
    { label: t('compareCollection'), values: fabrics.map((fabric) => fabric.collection || '—') },
    { label: t('compareColorVariants'), values: fabrics.map((fabric) => fabric.colorCount || (fabric.image ? t('compareGalleryAvailable') : t('compareUnavailable'))) },
    ...specKeys.map((key) => ({ label: key, values: fabrics.map((fabric) => fabric.specs?.[key] || '—') })),
  ]

  return (
    <div className="comparison-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="comparison-dialog" role="dialog" aria-modal="true" aria-labelledby="comparison-title">
        <div className="comparison-dialog-header">
          <div>
            <p className="eyebrow">{t('compareEyebrow')}</p>
            <h2 id="comparison-title">{t('compareTitle')}</h2>
          </div>
          <div className="comparison-dialog-actions">
            <button type="button" className="comparison-details-toggle" onClick={() => setShowDetails((current) => !current)} aria-expanded={showDetails}>
              {showDetails ? t('hideCompareDetails') : t('compareDetails')}
            </button>
            <button type="button" className="comparison-close" onClick={onClose} aria-label={t('close')}>×</button>
          </div>
        </div>
        <div className="comparison-mobile-products">
          {fabrics.map((fabric) => (
            <article className="comparison-mobile-product" key={fabric.id}>
              <div className={`comparison-mobile-image ${fabric.texture || 'tex-forest'}`}>
                {fabric.image ? (
                  <picture>
                    {getWebpSource(fabric.image) && <source srcSet={getWebpSource(fabric.image)} type="image/webp" />}
                    <img src={fabric.image} alt={`${t('compareImageAlt')}: ${fabric.name}`} loading="lazy" decoding="async" />
                  </picture>
                ) : null}
              </div>
              <strong>{fabric.name}</strong>
              <button type="button" onClick={() => onRemove(fabric.id)}>{t('compareRemove')}</button>
            </article>
          ))}
        </div>
        {showDetails && (
          <div className="comparison-mobile-details is-visible">
            {detailRows.map((row) => (
              <section className="comparison-mobile-detail-row" key={row.label}>
                <h3>{row.label}</h3>
                <div>
                  {row.values.map((value, index) => <p key={`${row.label}-${fabrics[index].id}`}><strong>{fabrics[index].name}</strong>{value}</p>)}
                </div>
              </section>
            ))}
            <section className="comparison-mobile-detail-row">
              <h3>{t('compareQuote')}</h3>
              <div>
                {fabrics.map((fabric) => <p key={fabric.id}><strong>{fabric.name}</strong><Link to={`/collections/${fabric.id}`} className="comparison-quote-link">{t('compareViewQuote')}</Link></p>)}
              </div>
            </section>
          </div>
        )}
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Detail</th>
                {fabrics.map((fabric) => (
                  <th scope="col" key={fabric.id}>
                    <div className="comparison-product">
                      {fabric.image ? (
                        <picture>
                          {getWebpSource(fabric.image) && <source srcSet={getWebpSource(fabric.image)} type="image/webp" />}
                          <img src={fabric.image} alt={`${t('compareImageAlt')}: ${fabric.name}`} loading="lazy" decoding="async" />
                        </picture>
                      ) : <div className={`comparison-product-placeholder ${fabric.texture || 'tex-forest'}`} />}
                      <strong>{fabric.name}</strong>
                      <button type="button" onClick={() => onRemove(fabric.id)}>{t('compareRemove')}</button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">{t('compareDescription')}</th>{fabrics.map((fabric) => <td key={fabric.id}>{fabric.description || '—'}</td>)}</tr>
              <tr><th scope="row">{t('compareCollection')}</th>{fabrics.map((fabric) => <td key={fabric.id}>{fabric.collection || '—'}</td>)}</tr>
              <tr><th scope="row">{t('compareColorVariants')}</th>{fabrics.map((fabric) => <td key={fabric.id}>{fabric.colorCount || (fabric.image ? t('compareGalleryAvailable') : t('compareUnavailable'))}</td>)}</tr>
              {specKeys.map((key) => <tr key={key}><th scope="row">{key}</th>{fabrics.map((fabric) => <td key={fabric.id}>{fabric.specs?.[key] || '—'}</td>)}</tr>)}
              <tr><th scope="row">{t('compareQuote')}</th>{fabrics.map((fabric) => <td key={fabric.id}><Link to={`/collections/${fabric.id}`} className="comparison-quote-link">{t('compareViewQuote')}</Link></td>)}</tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default function Collections() {
  const { t, fabrics, isLoadingFabrics } = useSite()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [compareIds, setCompareIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sa-studio-compare') || '[]').slice(0, 4) } catch { return [] }
  })
  const [showComparison, setShowComparison] = useState(false)
  const restoredFilters = useRef(false)

  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam

  const activeCategory = searchParams.get('category') || 'All'
  const sortMode = ['featured', 'newest', 'oldest', 'relevant'].includes(searchParams.get('sort'))
    ? searchParams.get('sort')
    : 'featured'
  const searchQuery = searchParams.get('q') || ''
  const suggestions = useMemo(() => [...new Set(fabrics.flatMap((fabric) => [fabric.name, fabric.collection, ...(fabric.categories || [])].filter(Boolean)))].slice(0, 24), [fabrics])

  useEffect(() => {
    try { localStorage.setItem('sa-studio-compare', JSON.stringify(compareIds)) } catch { /* optional preference */ }
  }, [compareIds])

  useEffect(() => {
    if (restoredFilters.current) return
    restoredFilters.current = true
    const hasUrlState = ['category', 'q', 'sort', 'page'].some((key) => searchParams.has(key))
    if (hasUrlState) return
    try {
      const saved = JSON.parse(localStorage.getItem('sa-studio-collection-filters') || 'null')
      if (saved?.category || saved?.q || saved?.sort) {
        setSearchParams((previous) => {
          const params = new URLSearchParams(previous)
          if (saved.category && saved.category !== 'All') params.set('category', saved.category)
          if (saved.q) params.set('q', saved.q)
          if (saved.sort && saved.sort !== 'featured') params.set('sort', saved.sort)
          return params
        }, { replace: true })
      }
    } catch { /* optional preference */ }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    try { localStorage.setItem('sa-studio-collection-filters', JSON.stringify({ category: activeCategory, q: searchQuery, sort: sortMode })) } catch { /* optional preference */ }
  }, [activeCategory, searchQuery, sortMode])
  const updatePage = useCallback((newPage) => {
    setSearchParams((prevParams) => {
      const params = new URLSearchParams(prevParams)
      if (newPage === 1) {
        params.delete('page')
      } else {
        params.set('page', newPage.toString())
      }
      return params
    }, { replace: true })
  }, [setSearchParams])

  useEffect(() => {
    sessionStorage.setItem('sa-studio-collections-url', `/collections${location.search}`)
  }, [location.search])

  const categories = getCategoryList(fabrics)
  const filtered = useMemo(() => (activeCategory === 'All'
    ? fabrics
    : fabrics.filter((fabric) => fabric.categories?.includes(activeCategory))).filter((fabric) => {
      if (!searchQuery) return true
      const query = normalizeSearchText(searchQuery)
      const fields = getSearchFields(fabric)
      const searchableText = fields.join(' ')
      return searchableText.includes(query)
    }), [activeCategory, fabrics, searchQuery])

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sortMode === 'relevant' && searchQuery) {
      const query = normalizeSearchText(searchQuery)
      const tokens = query.split(' ').filter(Boolean)
      const score = (fabric) => {
        const fields = getSearchFields(fabric)
        const name = normalizeSearchText(fabric.name)
        return tokens.reduce((total, token) => {
          const fieldScore = fields.reduce((fieldTotal, field, index) => (
            fieldTotal + (field.includes(token) ? Math.max(1, 8 - index) : 0)
          ), 0)
          return total + fieldScore + (name === token ? 30 : name.includes(token) ? 12 : 0)
        }, 0)
      }
      return score(b) - score(a)
    }
    if (sortMode === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    if (sortMode === 'oldest') return new Date(a.created_at || 0) - new Date(b.created_at || 0)
    return Number(b.featured) - Number(a.featured)
  }), [filtered, searchQuery, sortMode])

  const hasFilters = activeCategory !== 'All' || Boolean(searchQuery)
  const setSearchQueryParam = (nextQuery) => {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous)
      if (nextQuery.trim()) params.set('q', nextQuery)
      else params.delete('q')
      params.delete('page')
      return params
    }, { replace: true })
  }
  const clearFilters = () => {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous)
      params.delete('category')
      params.delete('q')
      params.delete('sort')
      params.delete('page')
      return params
    }, { replace: true })
  }

  const toggleCompare = (id) => {
    setCompareIds((current) => current.includes(id)
      ? current.filter((value) => value !== id)
      : current.length < 4 ? [...current, id] : current)
  }

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const compareFabrics = compareIds.map((id) => fabrics.find((fabric) => fabric.id === id)).filter(Boolean)
  const newArrivals = [...fabrics].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 4)
  const recentlyViewed = (() => {
    try {
      const ids = JSON.parse(localStorage.getItem('sa-studio-recently-viewed') || '[]')
      return ids.map((id) => fabrics.find((fabric) => fabric.id === id)).filter(Boolean).slice(0, 4)
    } catch { return [] }
  })()

  const [jumpValue, setJumpValue] = useState('')
  const goToPage = useCallback((target) => {
    const next = Math.min(Math.max(1, target), pageCount)
    if (next === page) return
    updatePage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, pageCount, updatePage])

  useEffect(() => {
    if (!isLoadingFabrics && fabrics.length > 0 && page > pageCount) {
      updatePage(pageCount)
    }
  }, [fabrics.length, isLoadingFabrics, page, pageCount, updatePage])
  const categoryLabel = (category) => {
    const key = getCategoryTranslationKey(category)
    return key ? t(key) : category
  }

  // Compact page list: first page, a small window around the current page, and
  // the last page, with single-step gaps collapsed and larger gaps shown as "…".
  const paginationRange = useMemo(() => {
    const siblings = 1
    const pages = new Set([1, pageCount])
    for (let p = page - siblings; p <= page + siblings; p += 1) {
      if (p >= 1 && p <= pageCount) pages.add(p)
    }
    const ordered = [...pages].sort((a, b) => a - b)
    const range = []
    let prev = 0
    for (const p of ordered) {
      if (p - prev === 2) range.push(prev + 1)
      else if (p - prev > 2) range.push('...')
      range.push(p)
      prev = p
    }
    return range
  }, [pageCount, page])

  return (
    <div className="collections-page">
      <SEO title="Collections | SA Studio Luxury Fabrics" description="Explore SA Studio's considered edit of exceptional fabrics, upholstery, wallpaper and materials for interiors with character." image="/collections-bg.jpg" />
      <div className="collections-page-background" aria-hidden="true" />
      <div className="collections-content-card">
        <section className="collections-intro">
          <p className="eyebrow">SA Studio / {t('collections')}</p>
          <h1>{t('theCollections')}</h1>
          <p className="collections-intro-description">{t('collectionIntro')}</p>
          <div className="collections-controls" aria-label={t('collections')}>
            <label className="collections-control-field">
              <span>Collection</span>
              <select
                value={activeCategory}
                onChange={(event) => {
                  setSearchParams((previous) => {
                    const params = new URLSearchParams(previous)
                    if (event.target.value === 'All') params.delete('category')
                    else params.set('category', event.target.value)
                    params.delete('page')
                    return params
                  }, { replace: true })
                }}
                aria-label={t('collections')}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel(category)}
                  </option>
                ))}
              </select>
            </label>
            <label className="collections-search">
              <span className="sr-only">{t('searchCollections')}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQueryParam(event.target.value)}
                placeholder={t('searchCollections')}
                aria-label={t('searchCollections')}
                list="fabric-search-suggestions"
              />
              <datalist id="fabric-search-suggestions">{suggestions.map((suggestion) => <option value={suggestion} key={suggestion} />)}</datalist>
              {searchQuery && (
                <button type="button" className="collections-search-clear" onClick={() => setSearchQueryParam('')} aria-label="Clear search">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" style={{ width: 14, height: 14, margin: 0 }}>
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              )}
            </label>
            <label className="collections-control-field">
              <span>Sort by</span>
              <select value={sortMode} onChange={(event) => {
                setSearchParams((previous) => {
                  const params = new URLSearchParams(previous)
                  if (event.target.value === 'featured') params.delete('sort')
                  else params.set('sort', event.target.value)
                  params.delete('page')
                  return params
                }, { replace: true })
              }} aria-label={t('sort')}>
                <option value="featured">{t('sortFeatured')}</option>
                <option value="newest">{t('sortNewest')}</option>
                <option value="oldest">{t('sortOldest')}</option>
                {searchQuery && <option value="relevant">{t('sortRelevant')}</option>}
              </select>
            </label>
            <button type="button" className="collections-reset-button" onClick={clearFilters} disabled={!hasFilters}>
              Reset filters
            </button>
          </div>
          {!isLoadingFabrics && (
            <div className="collections-results-meta" role="status">
              <p>{sorted.length} {sorted.length === 1 ? t('result') : t('results')}</p>
              {hasFilters && <button type="button" onClick={clearFilters}>{t('clearFilters')}</button>}
            </div>
          )}
        </section>

        {newArrivals.length > 0 && page === 1 && !searchQuery && activeCategory === 'All' && (
          <section className="collections-featured-strip" aria-labelledby="new-arrivals-title">
            <div className="collections-section-heading"><div><p className="eyebrow">Just in</p><h2 id="new-arrivals-title">New Arrivals</h2></div><span>Fresh references from the studio edit</span></div>
            <div className="collections-strip-grid">{newArrivals.map((fabric) => <FabricCard key={`new-${fabric.id}`} fabric={fabric} compareIds={compareIds} onToggleCompare={toggleCompare} />)}</div>
          </section>
        )}

        <section className="collections-products" aria-label="Fabric collections" aria-busy={isLoadingFabrics}>
          {isLoadingFabrics ? (
            Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="collections-product-card" aria-hidden="true">
                <div className="collections-product-image skeleton" />
                <div className="collections-product-copy">
                  <div className="skeleton skeleton-line h-4 w-2/3" />
                  <div className="skeleton skeleton-line w-1/2" />
                </div>
              </div>
            ))
          ) : sorted.length > 0 ? (
            paged.map((fabric) => <FabricCard key={fabric.id} fabric={fabric} compareIds={compareIds} onToggleCompare={toggleCompare} />)
          ) : (
            <div className="collections-empty">
              <p>{hasFilters ? `${t('noFabricsFound')}.` : t('noCollections')}</p>
              {hasFilters && <button type="button" onClick={clearFilters}>{t('clearFilters')}</button>}
            </div>
          )}
        </section>

        {recentlyViewed.length > 0 && !searchQuery && (
          <section className="collections-recent-strip" aria-labelledby="recently-viewed-title">
            <div className="collections-section-heading"><div><p className="eyebrow">Your trail</p><h2 id="recently-viewed-title">Recently Viewed</h2></div></div>
            <div className="collections-strip-grid">{recentlyViewed.map((fabric) => <FabricCard key={`recent-${fabric.id}`} fabric={fabric} compareIds={compareIds} onToggleCompare={toggleCompare} />)}</div>
          </section>
        )}

        {compareFabrics.length > 0 && (
          <aside className="compare-bar" aria-live="polite">
            <span>{compareFabrics.length} / 4 {t('compareSelected')}</span>
            <div className="compare-bar-actions">
              <button type="button" onClick={() => setCompareIds([])}>{t('compareClear')}</button>
              <button type="button" className="compare-bar-primary" disabled={compareFabrics.length < 2} onClick={() => setShowComparison(true)}>{t('compareAction')}</button>
            </div>
          </aside>
        )}

        {showComparison && <ComparisonDialog fabrics={compareFabrics} onClose={() => setShowComparison(false)} onRemove={toggleCompare} />}

        {pageCount > 1 && (
          <nav className="collections-pagination" aria-label="Collections pages">
            <button
              type="button"
              className="collections-pagination-arrow"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
              aria-label={t('previous')}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M10 12L4 8l6-4" />
              </svg>
            </button>

            <div className="collections-pagination-pages">
              {paginationRange.map((pageNumber, idx) =>
                pageNumber === '...' ? (
                  <span key={`dots-${idx}`} className="collections-pagination-dots" aria-hidden="true">
                    …
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    type="button"
                    className={page === pageNumber ? 'is-active' : ''}
                    aria-current={page === pageNumber ? 'page' : undefined}
                    aria-label={`${t('page') || 'Page'} ${pageNumber}`}
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              className="collections-pagination-arrow"
              disabled={page === pageCount}
              onClick={() => goToPage(page + 1)}
              aria-label={t('next')}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M6 4l6 4-6 4" />
              </svg>
            </button>

            {pageCount > 7 && (
              <form
                className="collections-pagination-jump"
                onSubmit={(event) => {
                  event.preventDefault()
                  const value = parseInt(jumpValue, 10)
                  if (!Number.isNaN(value)) goToPage(value)
                  setJumpValue('')
                }}
              >
                <label htmlFor="page-jump">{t('goToPage') || 'Go to'}</label>
                <input
                  id="page-jump"
                  type="number"
                  min="1"
                  max={pageCount}
                  inputMode="numeric"
                  value={jumpValue}
                  onChange={(event) => setJumpValue(event.target.value)}
                  placeholder={String(page)}
                  aria-label={`${t('goToPage') || 'Go to page'} (1–${pageCount})`}
                />
                <span className="collections-pagination-total">/ {pageCount}</span>
              </form>
            )}
          </nav>
        )}

        <section className="collections-closing-banner">
          <p className="eyebrow eyebrow-on-accent">{t('studioEdit')}</p>
          <h2>{t('materialsRoom')}</h2>
          <Link to="/contact" className="collections-closing-cta">
            {t('contactUs')}
          </Link>
        </section>
      </div>
    </div>
  )
}