import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchFabrics } from '../data/fabrics'
import { useFavorites } from '../hooks/useFavorites'
import { useSite } from '../context/SiteContext'
import SEO from '../components/SEO'

export default function Favorites() {
  const { t } = useSite()
  const { favoriteIds, toggleFavorite } = useFavorites()
  const [fabrics, setFabrics] = useState([])

  useEffect(() => {
    let ignore = false
    fetchFabrics().then((items) => {
      if (!ignore) setFabrics(items)
    })
    return () => { ignore = true }
  }, [])

  const favorites = fabrics.filter((fabric) => favoriteIds.includes(String(fabric.id)))

  return (
    <div className="favorites-page px-6 py-16 lg:px-16">
      <SEO title="Favorites | SA Studio Luxury Fabrics" description="Your saved SA Studio fabrics." />
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-4">SA Studio / {t('favorites')}</p>
        <h1 className="font-serif text-5xl font-light text-charcoal">{t('favorites')}</h1>
        {favorites.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-px bg-cream-dark sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((fabric) => (
              <article key={fabric.id} className="relative bg-cream">
                <Link to={`/collections/${fabric.id}`} className="block">
                  {fabric.image ? <img src={fabric.image} alt={`${fabric.name} textile`} className="aspect-[0.82] w-full object-cover" /> : <div className={`aspect-[0.82] w-full ${fabric.texture || 'tex-forest'}`} />}
                  <div className="p-4"><p className="eyebrow mb-1">{fabric.category}</p><h2 className="font-serif text-2xl font-light text-charcoal">{fabric.name}</h2></div>
                </Link>
                <button type="button" onClick={() => toggleFavorite(fabric.id)} className="absolute right-3 top-3 bg-charcoal/70 p-2 text-white" aria-label={`Remove ${fabric.name} from favorites`}>♡</button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-cream-dark bg-cream p-10 text-center text-charcoal-light">
            <p>{t('noFavorites')}</p>
            <Link to="/collections" className="mt-6 inline-flex min-h-[44px] items-center bg-forest px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white">{t('browseCollections')}</Link>
          </div>
        )}
      </div>
    </div>
  )
}