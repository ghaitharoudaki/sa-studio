const categories = [
  { value: 'Upholstery', label: 'Upholstery', description: 'Chairs and sofas', icon: 'couch' },
  { value: 'Curtains', label: 'Curtains', description: 'Window textiles', icon: 'curtain' },
  { value: 'Wallpaper', label: 'Wallpaper', description: 'Wall coverings', icon: 'wallpaper' },
  { value: 'Borders', label: 'Borders', description: 'Trims and edging', icon: 'border' },
  { value: 'Outdoor Upholstery', label: 'Outdoor Upholstery', description: 'Weather-resistant textiles', icon: 'outdoor' },
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

  if (type === 'border') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 fill-none stroke-current stroke-[1.5]">
        <path d="M6 14h36M6 34h36" />
        <path d="M10 14v20M16 14v20M22 14v20M28 14v20M34 14v20M38 14v20" strokeDasharray="2 4" />
      </svg>
    )
  }

  if (type === 'outdoor') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" className="h-10 w-10 fill-none stroke-current stroke-[1.5]">
        <path d="M24 6v4M24 8c9 0 16 5 16 12H8c0-7 7-12 16-12Z" />
        <path d="M24 20v18M18 38h12M20 44h8" />
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

export default function CategoryPicker({ value = [], onChange, required = false }) {
  const toggle = (categoryValue) => {
    if (value.includes(categoryValue)) {
      onChange(value.filter((v) => v !== categoryValue))
    } else {
      onChange([...value, categoryValue])
    }
  }

  return (
    <fieldset>
      <legend className="block text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2">
        Categories {required && '*'} <span className="normal-case text-charcoal-light/70">(select all that apply)</span>
      </legend>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((category) => {
          const selected = value.includes(category.value)
          return (
            <button
              key={category.value}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(category.value)}
              className={`min-h-[128px] border p-4 text-left transition-colors ${selected ? 'border-forest bg-forest text-white' : 'border-cream-dark bg-white text-charcoal hover:border-forest'}`}
            >
              <CategoryIcon type={category.icon} />
              <span className="mt-2 block text-xs tracking-[0.12em] uppercase">{category.label}</span>
              <span className={`mt-1 block text-xs ${selected ? 'text-white/75' : 'text-charcoal-light'}`}>{category.description}</span>
            </button>
          )
        })}
      </div>
      {required && value.length === 0 && <p className="mt-2 text-xs text-charcoal-light">Choose at least one category before saving.</p>}
    </fieldset>
  )
}