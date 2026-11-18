import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getSpecTranslationKey, getCategoryTranslationKey } from '../lib/i18nHelpers'
import { useSite } from '../context/SiteContext'
import { useCompareFabrics } from '../hooks/useCompareFabrics'
import { useModalBehavior } from '../hooks/useModalBehavior'

const labelCell = 'p-4 text-start align-top font-semibold text-charcoal-light text-xs uppercase tracking-wider'

function CompareFabrics({ onClose }) {
  const { t, fabrics } = useSite()
  const { compareIds, removeFromCompare, clearCompare } = useCompareFabrics()
  const closeRef = useRef(null)
  useModalBehavior(onClose, closeRef)

  // Keep the order the visitor picked them in.
  const selected = useMemo(
    () => compareIds.map((id) => fabrics.find((f) => String(f.id) === id)).filter(Boolean),
    [compareIds, fabrics],
  )

  // Nothing left to compare (last one removed, or ids no longer exist): close.
  const isEmpty = selected.length === 0
  useEffect(() => {
    if (isEmpty) onClose()
  }, [isEmpty, onClose])
  if (isEmpty) return null

  const allSpecKeys = [...new Set(selected.flatMap((f) => Object.keys(f.specs || {})))]
  const translate = (key, fallback) => (key ? t(key) : fallback)

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-title"
        className="bg-white w-full max-w-7xl max-h-[90vh] overflow-auto shadow-2xl"
      >
        <div className="sticky top-0 bg-white border-b border-cream-dark p-4 sm:p-6 flex items-center justify-between gap-4 z-10">
          <h2 id="compare-title" className="font-serif text-2xl text-charcoal">
            {t('compareFabrics')} ({selected.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearCompare}
              className="px-4 text-[11px] tracking-[0.2em] uppercase text-charcoal-light hover:text-forest transition-colors min-h-[44px]"
            >
              {t('clearAll')}
            </button>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="rounded-full hover:bg-cream-light transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={t('close')}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <td className="min-w-[120px]" />
                {selected.map((fabric) => (
                  <th key={fabric.id} scope="col" className="p-4 min-w-[220px] text-start align-top font-normal">
                    <Link to={`/collections/${fabric.id}`} className="block group" onClick={onClose}>
                      {fabric.image ? (
                        <img src={fabric.image} alt="" loading="lazy" className="w-full aspect-[4/3] object-cover mb-3" />
                      ) : (
                        <div className={`w-full aspect-[4/3] ${fabric.texture || 'bg-cream-light'} mb-3`} />
                      )}
                      <p className="eyebrow text-xs mb-1">{fabric.collection}</p>
                      <span className="font-serif text-lg text-charcoal group-hover:text-forest">{fabric.name}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(fabric.id)}
                      className="mt-2 text-[11px] tracking-[0.15em] uppercase text-charcoal-light hover:text-burgundy min-h-[44px]"
                    >
                      {t('removeFromCompare')}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-cream-dark">
                <th scope="row" className={labelCell}>{t('usage')}</th>
                {selected.map((fabric) => (
                  <td key={fabric.id} className="p-4 text-sm text-charcoal">
                    {fabric.categories?.map((cat) => translate(getCategoryTranslationKey(cat), cat)).join(', ') || '-'}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-cream-dark">
                <th scope="row" className={labelCell}>{t('description')}</th>
                {selected.map((fabric) => (
                  <td key={fabric.id} className="p-4">
                    <p className="text-sm text-charcoal-light line-clamp-4">{fabric.description || '-'}</p>
                  </td>
                ))}
              </tr>
              {allSpecKeys.map((key) => (
                <tr key={key} className="border-t border-cream-dark">
                  <th scope="row" className={labelCell}>{translate(getSpecTranslationKey(key), key)}</th>
                  {selected.map((fabric) => (
                    <td key={fabric.id} className="p-4 text-sm text-charcoal">{fabric.specs?.[key] || '-'}</td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-cream-dark">
                <th scope="row" className={labelCell}>{t('reference')}</th>
                {selected.map((fabric) => (
                  <td key={fabric.id} className="p-4 text-sm text-charcoal">{fabric.reference || '-'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CompareFabrics
