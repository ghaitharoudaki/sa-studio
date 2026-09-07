const categories = [
  { value: 'Upholstery', label: 'Upholstery', description: 'Chairs and sofas', icon: 'couch' },
  { value: 'Curtains', label: 'Curtains', description: 'Window textiles', icon: 'curtain' },
  { value: 'Wallpaper', label: 'Wallpaper', description: 'Wall coverings', icon: 'wallpaper' },
]

function CategoryIcon({ type }) {
  if (type === 'couch') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 fill-none stroke-current stroke-[1.5]">
        <path d="M9 25v-4a5 5 0 0 1 5-5h20a5 5 0 0 1 5 5v4" />
        <path d="M6 26a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v9H6v-9Z" />
        <path d="M10 35v4M38 35v4M12 27h24" />
      </svg>
    )
  }

  if (type === 'curtain') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 fill-none stroke-current stroke-[1.5]">
        <path d="M8 9h32M12 9v29M36 9v29M12 15c3 2 3 5 0 8s-3 6 0 9M36 15c-3 2-3 5 0 8s3 6 0 9" />
        <path d="M8 39h32" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 fill-none stroke-current stroke-[1.5]">
      <path d="M8 10h32v28H8zM14 10v28M34 10v28" />
      <path d="m14 18 5-4 5 4 5-4 5 4M14 28l5-4 5 4 5-4 5 4" />
    </svg>
  )
}

export default function CategoryPicker({ value, onChange, required = false }) {
  return (
    <fieldset>
      <legend className="block text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2">
        Category {required && '*'}
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {categories.map((category) => {
          const selected = value === category.value
          return (
            <button
              key={category.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(category.value)}
              className={`min-h-[128px] border p-4 text-left transition-colors ${selected ? 'border-forest bg-forest text-white' : 'border-cream-dark bg-white text-charcoal hover:border-forest'}`}
            >
              <CategoryIcon type={category.icon} />
              <span className="mt-2 block text-xs tracking-[0.12em] uppercase">{category.label}</span>
              <span className={`mt-1 block text-xs ${selected ? 'text-white/75' : 'text-charcoal-light'}`}>{category.description}</span>
            </button>
          )
        })}
      </div>
      {required && !value && <p className="mt-2 text-xs text-charcoal-light">Choose a category before saving.</p>}
    </fieldset>
  )
}