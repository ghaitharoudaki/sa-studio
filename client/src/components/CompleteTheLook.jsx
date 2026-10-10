import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSite } from '../context/SiteContext'
import { getCategoryTranslationKey } from '../lib/i18nHelpers'

// Which categories pair well with each source category
const PAIRING_MAP = {
  'Upholstery':          ['Curtains', 'Borders'],
  'Curtains':            ['Upholstery', 'Borders'],
  'Wallpaper':           ['Curtains', 'Upholstery'],
  'Outdoor Upholstery':  ['Curtains', 'Borders', 'Upholstery'],
  'Borders':             ['Curtains', 'Upholstery'],
}

// Max cards shown per target category
const MAX_PER_CATEGORY = 3

/**
 * Given the source fabric, pick the best matches in each paired category.
 * Scoring (higher = better fit):
 *   +2  same collection (house-curated pairs)
 *   +1  any other match in the right category
 * Same-category fabrics are excluded entirely.
 */
function getPairings(source, allFabrics) {
  const sourceCategories = source.categories || []

  // Collect all target categories from every category the source has
  const targetCategorySet = new Set()
  sourceCategories.forEach((cat) => {
    ;(PAIRING_MAP[cat] || []).forEach((t) => targetCategorySet.add(t))
  })

  if (targetCategorySet.size === 0) return []

  // Exclude same-category items and the fabric itself
  const candidates = allFabrics.filter((f) => {
    if (f.id === source.id) return false
    const fCategories = f.categories || []
    // Must have at least one target category
    if (!fCategories.some((c) => targetCategorySet.has(c))) return false
    // Must NOT share any category with the source (pure cross-category only)
    if (fCategories.some((c) => sourceCategories.includes(c))) return false
    return true
  })

  // Score and sort
  const scored = candidates.map((f) => {
    const fCategories = f.categories || []
    let score = 1 // base: correct cross-category
    if (f.collection && f.collection === source.collection) score += 2
    // Boost fabrics that match more of the requested target categories
    const catMatches = fCategories.filter((c) => targetCategorySet.has(c)).length
    score += catMatches * 0.5
    return { fabric: f, score, matchedCategories: fCategories.filter((c) => targetCategorySet.has(c)) }
  })

  scored.sort((a, b) => b.score - a.score)

  // Group by first matched target category, cap per group
  const groups = {}
  targetCategorySet.forEach((cat) => { groups[cat] = [] })

  scored.forEach(({ fabric, matchedCategories }) => {
    matchedCategories.forEach((cat) => {
      if (groups[cat] && groups[cat].length < MAX_PER_CATEGORY) {
        if (!groups[cat].find((item) => item.id === fabric.id)) {
          groups[cat].push(fabric)
        }
      }
    })
  })

  // Return groups in a stable order (same as PAIRING_MAP order for first source category)
  const firstSourceCat = sourceCategories.find((c) => PAIRING_MAP[c])
  const orderedTargets = firstSourceCat ? PAIRING_MAP[firstSourceCat] : [...targetCategorySet]

  return orderedTargets
    .filter((cat) => groups[cat]?.length > 0)
    .map((cat) => ({ category: cat, fabrics: groups[cat] }))
}

function PairingCard({ fabric }) {
  const { t } = useSite()
  const categories = fabric.categories || []

  return (
    <Link
      to={`/collections/${fabric.id}`}
      className="ctl-card group"
    >
      <div className="ctl-card-image">
        {fabric.image ? (
          <img
            src={fabric.image}
            alt={`${fabric.name} ${fabric.collection || ''} textile`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className={`w-full h-full ${fabric.texture || 'tex-forest'}`} />
        )}
        <div className="ctl-card-overlay" aria-hidden="true">
          <span>{t('viewDetails')}</span>
        </div>
      </div>
      <div className="ctl-card-body">
        <p className="eyebrow mb-1 truncate">
          {fabric.collection}
        </p>
        <h3 className="ctl-card-name">
          {fabric.name}
        </h3>
        <p className="ctl-card-cats">
          {categories
            .map((c) => (getCategoryTranslationKey(c) ? t(getCategoryTranslationKey(c)) : c))
            .join(' · ')}
        </p>
      </div>
    </Link>
  )
}

export default function CompleteTheLook({ fabric }) {
  const { t, fabrics } = useSite()
  const [activeTab, setActiveTab] = useState(null)

  const groups = useMemo(
    () => getPairings(fabric, fabrics),
    [fabric, fabrics]
  )

  if (groups.length === 0) return null

  // Default to first group tab
  const currentTab = activeTab ?? groups[0].category
  const currentGroup = groups.find((g) => g.category === currentTab) || groups[0]

  const categoryLabel = (cat) => {
    const key = getCategoryTranslationKey(cat)
    return key ? t(key) : cat
  }

  return (
    <section className="ctl-section" aria-labelledby="ctl-heading">
      {/* Header */}
      <div className="ctl-header">
        <div>
          <p className="eyebrow mb-3">{t('pairsWellWith')}</p>
          <h2 id="ctl-heading" className="ctl-title">
            {t('completeTheLook')}
          </h2>
          <p className="ctl-subtitle">
            {t('completeTheLookDesc')}
          </p>
        </div>

        {/* Category tabs — only shown when there are 2+ groups */}
        {groups.length > 1 && (
          <div className="ctl-tabs" role="tablist" aria-label={t('pairCategory')}>
            {groups.map((group) => (
              <button
                key={group.category}
                type="button"
                role="tab"
                aria-selected={group.category === currentTab}
                className={`ctl-tab ${group.category === currentTab ? 'is-active' : ''}`}
                onClick={() => setActiveTab(group.category)}
              >
                {categoryLabel(group.category)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cards */}
      <div
        className="ctl-grid"
        role="tabpanel"
        aria-label={categoryLabel(currentTab)}
      >
        {currentGroup.fabrics.map((f) => (
          <PairingCard key={f.id} fabric={f} />
        ))}
      </div>
    </section>
  )
}
