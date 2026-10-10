import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { useSite } from '../context/SiteContext'
import { getCategoryTranslationKey } from '../lib/i18nHelpers'
import SEO from '../components/SEO'

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-[18px] w-[18px]">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  )
}

export default function Favorites() {
  const { t, fabrics, isLoadingFabrics } = useSite()
  const { favoriteIds, toggleFavorite } = useFavorites()

  const favorites = fabrics.filter((fabric) => favoriteIds.includes(String(fabric.id)))

  return (
    <div className="favorites-page px-6 py-16 lg:px-16">
      <SEO title="Favorites | SA Studio Luxury Fabrics" description="Your saved SA Studio fabrics." />
      <div className="mx-auto max-w-7xl">
        <p className="eyebrow mb-4">SA Studio / {t('favorites')}</p>
        <h1 className="font-serif text-5xl font-light text-charcoal">{t('favorites')}</h1>
        {!isLoadingFabrics && favorites.length > 0 && (
          <p className="mt-4 text-sm text-charcoal-light">
            {favorites.length} {favorites.length === 1 ? t('result') : t('results')}
          </p>
        )}

        {isLoadingFabrics ? (
          <div className="mt-12 grid grid-cols-1 gap-px bg-cream-dark sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: Math.max(1, Math.min(favoriteIds.length, 4)) }, (_, i) => (
              <div key={i} className="bg-cream" aria-hidden="true">
                <div className="skeleton aspect-[0.82] w-full" />
                <div className="p-4"><div className="skeleton skeleton-line w-1/3" /><div className="skeleton skeleton-line h-5 w-2/3" /></div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-px bg-cream-dark sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((fabric) => (
              <article key={fabric.id} className="fabric-tile group relative">
                <Link to={`/collections/${fabric.id}`} className="block">
                  <div className="fabric-tile-media !aspect-[0.82]">
                    {fabric.image
                      ? <img src={fabric.image} alt={`${fabric.name} textile`} loading="lazy" decoding="async" />
                      : <div className={`h-full w-full ${fabric.texture || 'tex-forest'}`} />}
                  </div>
                  <div className="fabric-tile-body !p-4">
                    <p className="eyebrow mb-1">{getCategoryTranslationKey(fabric.categories?.[0]) ? t(getCategoryTranslationKey(fabric.categories[0])) : (fabric.categories?.[0] || fabric.category)}</p>
                    <h2>{fabric.name}</h2>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFavorite(fabric.id)}
                  className="collections-favorite-button is-favorite"
                  aria-label={`Remove ${fabric.name} from favorites`}
                  title={t('removeFavorite')}
                >
                  <HeartIcon />
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-cream-dark bg-cream px-6 py-16 text-center text-charcoal-light">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className="mx-auto mb-5 h-10 w-10 text-burgundy">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
            <p>{t('noFavorites')}</p>
            <Link to="/collections" className="primary-cta mt-6 inline-flex min-h-[44px] items-center px-6 py-3 text-[11px] uppercase tracking-[0.2em] transition-colors">{t('browseCollections')}</Link>
          </div>
        )}
      </div>
    </div>
  )
}
