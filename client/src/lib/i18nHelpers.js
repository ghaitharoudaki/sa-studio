export const getCategoryTranslationKey = (category = '') => {
  const normalized = String(category).trim().toLowerCase()
  const keys = {
    all: 'allCategories',
    upholstery: 'upholstery',
    curtains: 'curtains',
    curtain: 'curtains',
    wallpaper: 'wallpaper',
    borders: 'borders',
    'outdoor upholstery': 'outdoorUpholstery',
    fabric: 'fabric',
  }
  return keys[normalized] || null
}

export const getSpecTranslationKey = (spec = '') => {
  const normalized = String(spec).trim().toLowerCase()
  const keys = {
    width: 'width',
    height: 'height',
    weight: 'weight',
    material: 'material',
    composition: 'composition',
    use: 'use',
    usage: 'usage',
  }
  return keys[normalized] || null
}
