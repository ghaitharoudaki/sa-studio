import { useCallback, useEffect, useState } from 'react'
import { fetchFabrics, deleteFabric } from '../data/fabrics'
import FabricForm from '../components/FabricForm'

export default function AdminDashboard() {
  const [fabrics, setFabrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list' or 'form'
  const [selectedFabric, setSelectedFabric] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

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
      return
    }
    setFabrics((current) => current.filter((f) => f.id !== id))
    setDeleteConfirm(null)
  }

  const handleFormSubmit = async () => {
    await loadFabrics()
    setView('list')
    setSelectedFabric(null)
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
      || fabric.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="pt-[72px] px-8 lg:px-16 py-16 max-w-7xl mx-auto">
      <div className="mb-10">
        <p className="eyebrow mb-4">Dashboard</p>
        <h1 className="font-serif text-5xl font-light text-charcoal">Fabric Management</h1>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-10 border-b border-cream-dark">
        <button
          onClick={() => setView('list')}
          className={`px-6 py-3 text-sm tracking-[0.1em] uppercase transition-colors ${
            view === 'list' ? 'text-forest border-b-2 border-forest' : 'text-charcoal-light hover:text-charcoal'
          }`}
        >
          Fabrics List ({fabrics.length})
        </button>
        <button
          onClick={() => handleAddClick()}
          className={`px-6 py-3 text-sm tracking-[0.1em] uppercase transition-colors ${
            view === 'form' && !selectedFabric ? 'text-forest border-b-2 border-forest' : 'text-charcoal-light hover:text-charcoal'
          }`}
        >
          Add New Fabric
        </button>
        {view === 'form' && selectedFabric && (
          <span className="px-6 py-3 text-sm tracking-[0.1em] uppercase text-forest border-b-2 border-forest">
            Edit: {selectedFabric.name}
          </span>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-6">
          {fabrics.length > 0 && (
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search fabrics by name, collection, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full min-h-[44px] border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest"
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-charcoal-light">Loading fabrics...</div>
          ) : filteredFabrics.length === 0 ? (
            <div className="text-center py-12 bg-cream border border-cream-dark p-8">
              <p className="text-charcoal-light mb-4">No fabrics found</p>
              <button
                onClick={handleAddClick}
                className="min-h-[44px] px-8 py-3 bg-forest text-white text-[11px] tracking-[0.2em] uppercase hover:bg-forest-light transition-colors"
              >
                Add Your First Fabric
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredFabrics.map((fabric) => (
                <div key={fabric.id} className="bg-cream border border-cream-dark p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-start hover:border-charcoal-light transition-colors">
                  {fabric.image && (
                    <div className="md:col-span-1">
                      <img src={fabric.image} alt={fabric.name} loading="lazy" decoding="async" className="w-full h-48 object-cover" />
                    </div>
                  )}
                  <div className={fabric.image ? 'md:col-span-3' : 'md:col-span-4'}>
                    <div className="mb-4">
                      <h3 className="font-serif text-2xl font-light text-charcoal mb-1">{fabric.name}</h3>
                      <p className="text-sm text-charcoal-light">
                        {fabric.collection && <span>{fabric.collection}</span>}
                        {fabric.collection && fabric.category && <span> • </span>}
                        {fabric.category && <span>{fabric.category}</span>}
                      </p>
                      {fabric.description && <p className="text-sm text-charcoal mt-2 line-clamp-2">{fabric.description}</p>}
                    </div>

                    {Object.keys(fabric.specs).length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-4 text-xs">
                        {Object.entries(fabric.specs).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-charcoal-light uppercase tracking-[0.05em]">{key}:</span> {value}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => handleEditClick(fabric)}
                        className="px-4 py-2 bg-forest text-white text-xs tracking-[0.1em] uppercase hover:bg-forest-light transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(fabric.id)}
                        className="px-4 py-2 bg-charcoal-light/20 text-charcoal text-xs tracking-[0.1em] uppercase hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>

                    {deleteConfirm === fabric.id && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200">
                        <p className="text-sm text-charcoal mb-3">Are you sure you want to delete "{fabric.name}"? This action cannot be undone.</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleDelete(fabric.id)}
                            className="px-4 py-2 bg-red-600 text-white text-xs tracking-[0.1em] uppercase hover:bg-red-700 transition-colors"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 bg-charcoal-light/20 text-charcoal text-xs tracking-[0.1em] uppercase hover:bg-charcoal-light/30 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
