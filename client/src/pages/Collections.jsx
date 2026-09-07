import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFabrics, getCategoryList } from '../data/fabrics'
import { useSite } from '../context/SiteContext'

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
  const detail = fabric.collection || fabric.specs?.Composition || 'SA Studio textile'

  return (
    <Link to={`/collections/${fabric.id}`} className="collections-product-card group">
      <div className="collections-product-image">
        {fabric.image ? (
          <img src={fabric.image} alt={fabric.name} />
        ) : (
          <div className={`h-full w-full ${fabric.texture || 'tex-forest'}`} />
        )}
        <span className="collections-product-tag">
          {fabric.category || 'New Arrival'}
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

  return (
    <div className="collections-page pt-[72px]">
      <div className="collections-page-background" aria-hidden="true" />
      <main className="collections-content-card">
        <section className="collections-intro">
          <p className="eyebrow">SA Studio / {t('collections')}</p>
          <h1>{t('theCollections')}</h1>
          <p className="collections-intro-description">
            A considered edit of exceptional fabrics and materials for interiors with depth,
            character, and a distinct sense of place. Explore each collection by touch,
            texture, and origin.
          </p>
          <div className="collections-controls" aria-label="Collection filters">
            <div className="collections-filter-list">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? 'is-active' : ''}
                >
                  {category}
                </button>
              ))}
            </div>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} aria-label="Sort collections">
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
          </div>
        </section>

        <section className="collections-products" aria-label="Fabric collections">
          {sorted.length > 0 ? (
            sorted.map((fabric) => <FabricCard key={fabric.id} fabric={fabric} />)
          ) : (
            <p className="collections-empty">No collections are available yet.</p>
          )}
        </section>

        <div className="collections-see-more">
          <Link to="/about" className="collections-see-more-link">
            <span>See more collections</span>
            <ArrowBox />
          </Link>
        </div>

        <section className="collections-closing-banner">
          <p className="eyebrow eyebrow-on-accent">The SA Studio edit</p>
          <h2>Materials that make a room feel like yours.</h2>
          <Link to="/about" className="collections-closing-cta">
            {t('contactUs')}
          </Link>
        </section>
      </main>
    </div>
  )
}
