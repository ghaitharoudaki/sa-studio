import { useState } from 'react'
import { Link } from 'react-router-dom'
import { fabrics, categories } from '../data/fabrics'

function FabricCard({ fabric }) {
  return (
    <Link
      to={`/collections/${fabric.id}`}
      className="group block overflow-hidden bg-cream shadow-sm transition-transform duration-500 hover:-translate-y-1 hover:shadow-deep"
    >
      <div className="relative h-80 overflow-hidden">
        {fabric.image ? (
          <img
            src={fabric.image}
            alt={fabric.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className={`w-full h-full ${fabric.texture} transition-transform duration-700 group-hover:scale-105`}
          />
        )}
        <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-[11px] tracking-[0.25em] uppercase border border-white/60 px-5 py-2.5">
            View Details
          </span>
        </div>
        <div className="absolute top-4 left-4 bg-charcoal/70 px-3 py-1">
          <span className="text-white text-[10px] tracking-[0.2em] uppercase">
            {fabric.collection}
          </span>
        </div>
      </div>
      <div className="p-5 border-b border-cream-dark">
        <p className="text-[10px] tracking-[0.25em] uppercase text-forest mb-1">
          {fabric.category}
        </p>
        <h3 className="font-serif text-xl font-light text-charcoal mb-1">
          {fabric.name}
        </h3>
        <p className="text-xs text-charcoal-light">
          {fabric.specs.Composition}
        </p>
      </div>
    </Link>
  )
}

export default function Collections() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [sortMode, setSortMode] = useState('A–Z')

  const filtered =
    activeCategory === 'All'
      ? fabrics
      : fabrics.filter((f) => f.category === activeCategory)

  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === 'A–Z') return a.name.localeCompare(b.name)
    if (sortMode === 'Z–A') return b.name.localeCompare(a.name)
    return a.collection.localeCompare(b.collection)
  })

  const displayMode = viewMode === 'list' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5'

  return (
    <div className="pt-[72px]">

      {/* Header */}
      <div
        className="px-8 lg:px-16 py-16 border-b border-cream-dark"
        style={{ background: '#F0EFED' }}
      >
        <p className="text-[11px] tracking-[0.3em] uppercase text-forest mb-4">
          SA Studio
        </p>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <h1 className="font-serif text-5xl lg:text-6xl font-light text-charcoal leading-tight">
            The <em className="text-forest">Collections</em>
          </h1>
          <p className="text-sm text-charcoal-light max-w-sm leading-loose lg:text-right">
            Each fabric is selected for its technical excellence and aesthetic
            distinction. {fabrics.length} references across{' '}
            {categories.length - 1} categories.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="px-8 lg:px-16 py-4 border-b border-cream-dark bg-cream flex gap-3 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 min-h-[44px] px-5 py-2 text-[11px] tracking-[0.18em] uppercase transition-all duration-200 border ${
              activeCategory === cat
                ? 'bg-forest text-white border-forest'
                : 'bg-transparent text-charcoal-light border-cream-dark hover:border-forest hover:text-forest'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="px-8 lg:px-16 py-4 border-b border-cream-dark bg-cream flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-charcoal-light tracking-[0.15em] uppercase">
          Showing {sorted.length} {sorted.length === 1 ? 'result' : 'results'}
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-charcoal-light">
            <span>Sort</span>
            {['A–Z', 'Z–A', 'Collection'].map((option) => (
              <button
                key={option}
                onClick={() => setSortMode(option)}
                className={`min-h-[36px] px-3 py-2 border text-[11px] tracking-[0.18em] uppercase transition-all duration-200 ${
                  sortMode === option
                    ? 'bg-forest text-white border-forest'
                    : 'bg-transparent text-charcoal-light border-cream-dark hover:border-forest hover:text-forest'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-charcoal-light">
            <span>View</span>
            {['grid', 'list'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`min-h-[36px] px-3 py-2 border text-[11px] tracking-[0.18em] uppercase transition-all duration-200 ${
                  viewMode === mode
                    ? 'bg-forest text-white border-forest'
                    : 'bg-transparent text-charcoal-light border-cream-dark hover:border-forest hover:text-forest'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className={`${displayMode} bg-cream-dark p-0.5`}>
        {sorted.map((fabric) => (
          <FabricCard key={fabric.id} fabric={fabric} />
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        className="px-8 lg:px-20 py-16 text-center"
        style={{ background: '#1C1C1A' }}
      >
        <p className="text-[11px] tracking-[0.3em] uppercase text-white/40 mb-4">
          Can't find what you're looking for?
        </p>
        <h2 className="font-serif text-3xl font-light text-white mb-8">
          Speak with our team about <em className="text-forest-light">custom orders</em>
        </h2>
        <Link
          to="/about"
          className="inline-flex items-center min-h-[44px] px-10 py-3 border border-white/30 text-white text-[11px] tracking-[0.2em] uppercase hover:border-forest hover:text-forest-light transition-colors duration-200"
        >
          Contact Us
        </Link>
      </div>

    </div>
  )
}