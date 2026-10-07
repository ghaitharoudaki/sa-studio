import { useCallback, useEffect, useState } from 'react'
import { fetchFabrics, deleteFabric, updateFabric, bulkUpdateFeatured, bulkDeleteFabrics } from '../data/fabrics'
import FabricForm from '../components/FabricForm'
import { useSite } from '../context/SiteContext'
import { getCategoryTranslationKey, getSpecTranslationKey } from '../lib/i18nHelpers'

export default function AdminDashboard() {
  const { t } = useSite()
  const [fabrics, setFabrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list' or 'form'
  const [selectedFabric, setSelectedFabric] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [toast, setToast] = useState(null)

  const loadFabrics = useCallback(async () => {
    setLoading(true)
    const items = await fetchFabrics()
    setFabrics(items)
    setLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false
    fetchFabrics().then((items) => {
      if (!ignore) {
        setFabrics(items)
        setLoading(false)
      }
    })

    return () => {
      ignore = true
    }
  }, [])

  const handleDelete = async (id) => {
    const { error } = await deleteFabric(id)
    if (error) {
      console.error('Delete error:', error)
      setToast({ type: 'error', message: t('actionFailed') })
      return
    }
    setFabrics((current) => current.filter((f) => f.id !== id))
    setDeleteConfirm(null)
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id))
    setToast({ type: 'success', message: t('deleteSuccess') })
  }

  const handleFormSubmit = async () => {
    await loadFabrics()
    setView('list')
    setSelectedFabric(null)
    setToast({ type: 'success', message: t('saveSuccess') })
  }

  const handleToggleFeatured = async (fabric) => {
    const nextFeatured = !fabric.featured
    const { data, error } = await updateFabric(fabric.id, { ...fabric, featured: nextFeatured })
    if (error) {
      console.error('Featured toggle error:', error)
      setToast({ type: 'error', message: t('actionFailed') })
      return
    }
    setFabrics((current) => current.map((item) => (item.id === fabric.id ? data : item)))
    setToast({ type: 'success', message: nextFeatured ? t('feature') : t('unfeature') })
  }

  const handleBulkFeatured = async (featured) => {
    if (!selectedIds.length) return
    const { data, error } = await bulkUpdateFeatured(selectedIds, featured)
    if (error) {
      console.error('Bulk featured update error:', error)
      setToast({ type: 'error', message: t('actionFailed') })
      return
    }
    const updatedById = new Map(data.map((item) => [item.id, item]))
    setFabrics((current) => current.map((item) => updatedById.get(item.id) || item))
    setSelectedIds([])
    setToast({ type: 'success', message: t('bulkSaveSuccess') })
  }

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return
    const { error } = await bulkDeleteFabrics(selectedIds)
    if (error) {
      console.error('Bulk delete error:', error)
      setToast({ type: 'error', message: t('actionFailed') })
      return
    }
    const selectedSet = new Set(selectedIds)
    setFabrics((current) => current.filter((item) => !selectedSet.has(item.id)))
    setSelectedIds([])
    setToast({ type: 'success', message: t('bulkDeleteSuccess') })
  }

  const toggleSelected = (id) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((selectedId) => selectedId !== id)
      : [...current, id])
  }

  const handleEditClick = (fabric) => {
    setSelectedFabric(fabric)
    setView('form')
  }

  const handleAddClick = () => {
    setSelectedFabric(null)
    setView('form')
  }

  const handleCancel = () => {
    setView('list')
    setSelectedFabric(null)
  }

  const filteredFabrics = fabrics.filter(
    (fabric) =>
      fabric.name.toLowerCase().includes(searchTerm.toLowerCase())
      || fabric.collection.toLowerCase().includes(searchTerm.toLowerCase())
      || (fabric.categories || []).some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())),
  )
  const featuredFabrics = filteredFabrics.filter((fabric) => fabric.featured)
  const allVisibleSelected = filteredFabrics.length > 0 && filteredFabrics.every((fabric) => selectedIds.includes(fabric.id))

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeout)
  }, [toast])

  return (
    <div className="px-8 lg:px-16 py-16 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="eyebrow mb-4">{t('dashboard')}</p>
        <h1 className="font-serif text-5xl font-light text-charcoal">{t('fabricManagement')}</h1>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-10 border-b border-cream-dark">
        <button
          onClick={() => setView('list')}
          className={`px-6 py-3 text-sm tracking-[0.1em] uppercase transition-colors ${
            view === 'list' ? 'text-forest border-b-2 border-forest' : 'text-charcoal-light hover:text-charcoal'
          }`}
        >
          {t('fabricsList')} ({fabrics.length})
        </button>
        <button
          onClick={() => setView('featured')}
          className={`px-6 py-3 text-sm tracking-[0.1em] uppercase transition-colors ${
            view === 'featured' ? 'text-forest border-b-2 border-forest' : 'text-charcoal-light hover:text-charcoal'
          }`}
        >
          {t('featuredFabrics')} ({fabrics.filter((fabric) => fabric.featured).length})
        </button>
        <button
          onClick={() => handleAddClick()}
          className={`px-6 py-3 text-sm tracking-[0.1em] uppercase transition-colors ${
            view === 'form' && !selectedFabric ? 'text-forest border-b-2 border-forest' : 'text-charcoal-light hover:text-charcoal'
          }`}
        >
          {t('addNewFabric')}
        </button>
        {view === 'form' && selectedFabric && (
          <span className="px-6 py-3 text-sm tracking-[0.1em] uppercase text-forest border-b-2 border-forest">
            {t('edit')}: {selectedFabric.name}
          </span>
        )}
      </div>

      {toast && (
        <div role="status" className={`fixed right-5 top-5 z-50 max-w-sm border px-5 py-4 text-sm shadow-lg ${toast.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-forest/20 bg-forest text-white'}`}>
          {toast.message}
        </div>
      )}

      {view === 'list' || view === 'featured' ? (
        <div className="space-y-6">
          {fabrics.length > 0 && (
            <div className="mb-6">
              <input
                type="text"
                placeholder={t('searchFabrics')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-[44px] border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest"
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-charcoal-light">{t('loadingFabrics')}</div>
          ) : (view === 'featured' ? featuredFabrics : filteredFabrics).length === 0 ? (
            <div className="text-center py-12 bg-cream border border-cream-dark p-8">
              <p className="text-charcoal-light mb-4">{view === 'featured' ? t('noFeaturedFabrics') : t('noFabricsFound')}</p>
              <button
                onClick={handleAddClick}
                className="min-h-[44px] px-8 py-3 bg-forest text-white text-[11px] tracking-[0.2em] uppercase hover:bg-forest-light transition-colors"
              >
                {t('addFirstFabric')}
              </button>
            </div>
          ) : (
            <>
              {view === 'list' && (
                <div className="flex flex-wrap items-center gap-3 border border-cream-dark bg-cream p-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={allVisibleSelected} onChange={() => setSelectedIds(allVisibleSelected ? [] : filteredFabrics.map((fabric) => fabric.id))} />
                    {t('selectAll')}
                  </label>
                  {selectedIds.length > 0 && (
                    <>
                      <span className="text-sm text-charcoal-light">{selectedIds.length} {t('selected')}</span>
                      <button onClick={() => handleBulkFeatured(true)} className="px-3 py-2 bg-forest text-white text-xs uppercase tracking-[0.1em]">{t('featureSelected')}</button>
                      <button onClick={() => handleBulkFeatured(false)} className="px-3 py-2 bg-charcoal-light/20 text-charcoal text-xs uppercase tracking-[0.1em]">{t('unfeatureSelected')}</button>
                      <button onClick={handleBulkDelete} className="px-3 py-2 bg-red-600 text-white text-xs uppercase tracking-[0.1em]">{t('deleteSelected')}</button>
                    </>
                  )}
                </div>
              )}
              <div className={view === 'featured' ? 'overflow-x-auto border border-cream-dark' : 'grid gap-4'}>
              {(view === 'featured' ? featuredFabrics : filteredFabrics).map((fabric, index) => (
                <div key={fabric.id} className="bg-cream border border-cream-dark p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-start hover:border-charcoal-light transition-colors">
                  {view === 'list' && (
                    <label className="absolute ml-2 mt-2 z-10">
                      <input type="checkbox" checked={selectedIds.includes(fabric.id)} onChange={() => toggleSelected(fabric.id)} aria-label={`${t('selectAll')} ${fabric.name}`} />
                    </label>
                  )}
                  {fabric.image && (
                    <div className="md:col-span-1">
                      <img src={fabric.image} alt={`${fabric.name} ${fabric.collection || ''} textile`} loading="lazy" decoding="async" className="w-full h-48 object-cover" />
                    </div>
                  )}
                  <div className={fabric.image ? 'md:col-span-3' : 'md:col-span-4'}>
                    <div className="mb-4">
                      <h3 className="font-serif text-2xl font-light text-charcoal mb-1">{fabric.name}</h3>
                      <p className="text-sm text-charcoal-light">
                        {fabric.collection && <span>{fabric.collection}</span>}
                        {fabric.collection && fabric.categories?.length > 0 && <span> • </span>}
                        {fabric.categories?.length > 0 && <span>{fabric.categories.map((category) => getCategoryTranslationKey(category) ? t(getCategoryTranslationKey(category)) : category).join(', ')}</span>}
                      </p>
                      {fabric.description && <p className="text-sm text-charcoal mt-2 line-clamp-2">{fabric.description}</p>}
                    </div>

                    {Object.keys(fabric.specs).length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-4 text-xs">
                        {Object.entries(fabric.specs).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-charcoal-light uppercase tracking-[0.05em]">{getSpecTranslationKey(key) ? t(getSpecTranslationKey(key)) : key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => handleEditClick(fabric)}
                        className="px-4 py-2 bg-forest text-white text-xs tracking-[0.1em] uppercase hover:bg-forest-light transition-colors"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(fabric)}
                        className="px-4 py-2 border border-forest text-forest text-xs tracking-[0.1em] uppercase hover:bg-forest hover:text-white transition-colors"
                      >
                        {fabric.featured ? t('unfeature') : t('feature')}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(fabric.id)}
                        className="px-4 py-2 bg-charcoal-light/20 text-charcoal text-xs tracking-[0.1em] uppercase hover:bg-red-200 transition-colors"
                      >
                        {t('delete')}
                      </button>
                    </div>

                    {deleteConfirm === fabric.id && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200">
                        <p className="text-sm text-charcoal mb-3">{t('deleteConfirm')}</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDelete(fabric.id)}
                            className="px-4 py-2 bg-red-600 text-white text-xs tracking-[0.1em] uppercase hover:bg-red-700 transition-colors"
                          >
                            {t('yesDelete')}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 bg-charcoal-light/20 text-charcoal text-xs tracking-[0.1em] uppercase hover:bg-charcoal-light/30 transition-colors"
                          >
                            {t('cancel')}
                          </button>
                        </div>
                      </div>
                    )}
                    {view === 'featured' && (
                      <p className="mt-3 text-xs text-charcoal-light">
                        {t('rank')}: {index + 1} · {t('homepagePreview')}: <span className="text-forest">{t('visibleOnHomepage')}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div>
          <FabricForm key={selectedFabric?.id || 'new'} fabric={selectedFabric} onSubmit={handleFormSubmit} onCancel={handleCancel} isLoading={loading} />
        </div>
      )}
    </div>
  )
}