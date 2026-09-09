import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFabrics, getCategoryList } from '../data/fabrics'
import { useSite } from '../context/SiteContext'
import SEO from '../components/SEO'

function ArrowBox() {
  return (
    <span className="collections-arrow-box" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 8h9M8 4l4 4-4 4" />
      </svg>
    </span>
  )
}

function FabricCard({ fabric }) {
  const { t } = useSite()
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
            {fabric.category || t('newArrival')}
        </span>
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
  const [sortMode, setSortMode] = useState('A-Z')

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
  const filtered = activeCategory === 'All'
    ? fabrics
    : fabrics.filter((fabric) => fabric.category === activeCategory)
  const sorted = [...filtered].sort((a, b) => (
    sortMode === 'Z-A' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
  ))
  const categoryLabel = (category) => {
    const key = category.toLowerCase() === 'all' ? 'allCategories' : category.toLowerCase()
    return ['wallpaper', 'upholstery', 'fabric'].includes(key) ? t(key) : category
  }

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
            <div className="collections-filter-list">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? 'is-active' : ''}
                >
                  {categoryLabel(category)}
                </button>
              ))}
            </div>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} aria-label={t('sort')}>
              <option value="A-Z">{t('sortAZ')}</option>
              <option value="Z-A">{t('sortZA')}</option>
            </select>
          </div>
        </section>

        <section className="collections-products" aria-label="Fabric collections">
          {sorted.length > 0 ? (
            sorted.map((fabric) => <FabricCard key={fabric.id} fabric={fabric} />)
          ) : (
            <p className="collections-empty">{t('noCollections')}</p>
          )}
        </section>

        <div className="collections-see-more">
          <Link to="/about" className="collections-see-more-link">
            <span>{t('seeMoreCollections')}</span>
            <ArrowBox />
          </Link>
        </div>

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
