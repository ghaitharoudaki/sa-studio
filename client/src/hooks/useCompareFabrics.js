import { useCallback, useSyncExternalStore } from 'react'

const COMPARE_STORAGE_KEY = 'sa-studio-compare-fabrics'
const COMPARE_EVENT = 'sa-studio-compare-change'
export const MAX_COMPARE_ITEMS = 4

const EMPTY = []
let cachedRaw = null
let cachedIds = EMPTY

// One shared store backed by localStorage, so every card, the toolbar button
// and the modal read the same list (and other tabs stay in sync too).
const readIds = () => {
  let raw = null
  try {
    raw = window.localStorage.getItem(COMPARE_STORAGE_KEY)
  } catch {
    return cachedIds
  }
  if (raw === cachedRaw) return cachedIds
  cachedRaw = raw
  try {
    const parsed = JSON.parse(raw || '[]')
    cachedIds = Array.isArray(parsed) ? parsed.map(String).slice(0, MAX_COMPARE_ITEMS) : EMPTY
  } catch {
    cachedIds = EMPTY
  }
  return cachedIds
}

const writeIds = (ids) => {
  try {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Storage can be unavailable (private mode); keep an in-memory copy.
    cachedRaw = JSON.stringify(ids)
    cachedIds = ids
  }
  window.dispatchEvent(new Event(COMPARE_EVENT))
}

const subscribe = (callback) => {
  window.addEventListener('storage', callback)
  window.addEventListener(COMPARE_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(COMPARE_EVENT, callback)
  }
}

const getServerSnapshot = () => EMPTY

export function useCompareFabrics() {
  const compareIds = useSyncExternalStore(subscribe, readIds, getServerSnapshot)

  const addToCompare = useCallback((fabricId) => {
    const id = String(fabricId)
    const current = readIds()
    if (current.includes(id) || current.length >= MAX_COMPARE_ITEMS) return
    writeIds([...current, id])
  }, [])

  const removeFromCompare = useCallback((fabricId) => {
    const id = String(fabricId)
    writeIds(readIds().filter((existing) => existing !== id))
  }, [])

  const clearCompare = useCallback(() => writeIds([]), [])

  const isInCompare = useCallback((fabricId) => compareIds.includes(String(fabricId)), [compareIds])

  return {
    compareIds,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    canAddToCompare: compareIds.length < MAX_COMPARE_ITEMS,
    compareCount: compareIds.length,
  }
}
