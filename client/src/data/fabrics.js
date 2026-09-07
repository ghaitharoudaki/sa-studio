import { supabase } from '../lib/supabase'

export const WHATSAPP_NUMBER = '963944231337'
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`
export const INSTAGRAM_LINK = 'https://www.instagram.com/sa.studio.sy?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw=='
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
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const IMAGE_TYPES = {
  'image/avif': 'avif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function validateFabricImage(file) {
  if (!file || !IMAGE_TYPES[file.type]) return 'Please choose a JPG, PNG, WebP, or AVIF image.'
  if (file.size > MAX_IMAGE_SIZE) return 'Images must be 10 MB or smaller.'
  return ''
}

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
  const validationError = validateFabricImage(file)
  if (validationError) return { data: null, error: new Error(validationError) }

  const extension = IMAGE_TYPES[file.type]
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('fabric-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
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

const toWritableFabric = (formData) => {
  const normalized = normalizeFabric(formData)
  const row = {
    name: normalized.name,
    collection: normalized.collection,
    category: normalized.category,
    description: normalized.description,
    image: normalized.image,
    specs: normalized.specs,
  }
  if (formData?.texture != null) row.texture = normalized.texture
  return row
}

const ensureAdminSession = async () => {
  const { data: current } = await supabase.auth.getSession()
  if (!current.session) {
    return { session: null, error: new Error('Your admin session expired. Sign in again and retry.') }
  }

  const { data: refreshed, error } = await supabase.auth.refreshSession()
  const session = refreshed?.session || current.session
  if (error && !session) {
    return { session: null, error: new Error('Your admin session expired. Sign in again and retry.') }
  }

  if (session.user.app_metadata?.role !== 'admin') {
    return { session: null, error: new Error('This account is not allowed to edit fabrics.') }
  }

  return { session, error: null }
}

export async function fetchFabrics() {
  if (!supabase) {
    return readFallback()
  }

  const { data, error } = await supabase.from('fabrics').select('*').order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase fabrics fetch error:', error)
    return []
  }

  const items = (data || []).map(normalizeFabric)
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

  const { error: sessionError } = await ensureAdminSession()
  if (sessionError) return { data: null, error: sessionError }

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

export async function updateFabric(id, formData) {
  const fabricId = String(id || '').trim()
  const payload = toWritableFabric({ ...formData, id: fabricId })

  if (!supabase) {
    const current = readFallback()
    const next = current.map((item) => (item.id === fabricId ? { ...item, ...payload, id: fabricId } : item))
    writeFallback(next)
    return { data: { ...payload, id: fabricId }, error: null }
  }

  const { error: sessionError } = await ensureAdminSession()
  if (sessionError) return { data: null, error: sessionError }

  const { data, error } = await supabase
    .from('fabrics')
    .update(payload)
    .eq('id', fabricId)
    .select()

  if (error) {
    console.error('Supabase update error:', error)
    return { data: null, error }
  }

  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    const { data: existing } = await supabase.from('fabrics').select('id').eq('id', fabricId).maybeSingle()
    return {
      data: null,
      error: new Error(
        existing
          ? 'No fabric was updated. Sign out, sign back in so your admin role is on this session, then try again.'
          : 'No fabric was updated. Refresh the list and verify that this fabric still exists.',
      ),
    }
  }

  const updated = normalizeFabric(row)
  const current = readFallback()
  const next = current.map((item) => (item.id === fabricId ? updated : item))
  writeFallback(next)

  return { data: updated, error: null }
}

export async function deleteFabric(id) {
  if (!supabase) {
    const current = readFallback()
    const next = current.filter((item) => item.id !== id)
    writeFallback(next)
    return { error: null }
  }

  const { error: sessionError } = await ensureAdminSession()
  if (sessionError) return { error: sessionError }

  const { error } = await supabase
    .from('fabrics')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase delete error:', error)
    return { error }
  }

  const current = readFallback()
  const next = current.filter((item) => item.id !== id)
  writeFallback(next)

  return { error: null }
}

export const categories = ['All']
export const collections = []