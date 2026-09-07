import { supabase } from '../lib/supabase'

export const WHATSAPP_NUMBER = '963 944 231 337'
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`
export const MAPS_LINK = 'https://maps.google.com/?q=Mazzeh+Street+Damascus+Syria'

export const PARTNER_BRANDS = [
  'Rubelli',
  'Pierre Frey',
  'Dedar',
  'Loro Piana',
  'Armani Casa',
  'Fine',
  'Omexco',
  'Arte',
  'Casamance',
  'Texam',
  'Roberto Cavali',
  'Marburg',
]

const FALLBACK_KEY = 'sa-studio-fabrics'

const makeId = (value = '') =>
  `${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'fabric'}-${Date.now()}`

const normalizeFabric = (item) => {
  const name = String(item?.name || 'Untitled fabric').trim()
  const collection = String(item?.collection || '').trim()
  const category = String(item?.category || '').trim()
  const texture = String(item?.texture || '').trim()
  const description = String(item?.description || '').trim()
  const image = String(item?.image || '').trim()

  return {
    id: String(item?.id || makeId(name)),
    name,
    collection,
    category,
    texture,
    image,
    description,
    specs: item?.specs || {},
  }
}

export async function uploadFabricImage(file) {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('fabric-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) return { data: null, error }

  const { data } = supabase.storage.from('fabric-images').getPublicUrl(path)
  return { data: data.publicUrl, error: null }
}
const readFallback = () => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(FALLBACK_KEY)
    return raw ? JSON.parse(raw).map(normalizeFabric) : []
  } catch {
    return []
  }
}

const writeFallback = (items) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(FALLBACK_KEY, JSON.stringify(items))
  } catch {
    // ignore localStorage write failures
  }
}

export const fabrics = []

export const getCategoryList = (items = []) => ['All', ...new Set(items.map((item) => item.category).filter(Boolean))]
export const getCollectionList = (items = []) => [...new Set(items.map((item) => item.collection).filter(Boolean))]

export async function fetchFabrics() {
  if (!supabase) {
    return readFallback()
  }

  const { data, error } = await supabase.from('fabrics').select('*').order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase fabrics fetch error:', error)
    return readFallback()
  }

  const items = (data || []).map(normalizeFabric)
  writeFallback(items)
  return items
}

export async function createFabric(formData) {
  const payload = normalizeFabric(formData)

  if (!supabase) {
    const current = readFallback()
    const next = [payload, ...current]
    writeFallback(next)
    return { data: [payload], error: null }
  }

  const { data, error } = await supabase
    .from('fabrics')
    .insert([payload])
    .select()
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return { data: null, error }
  }

  const saved = normalizeFabric(data)
  const current = readFallback()
  const next = [saved, ...current.filter((item) => item.id !== saved.id)]
  writeFallback(next)

  return { data: saved, error: null }
}

export const categories = ['All']
export const collections = []