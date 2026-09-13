import { useEffect, useState } from 'react'

export const FAVORITES_KEY = 'sa-studio-favorites'
const FAVORITES_EVENT = 'sa-studio-favorites-change'

const readFavorites = () => {
  if (typeof window === 'undefined') return []

  try {
    const value = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]')
    return Array.isArray(value) ? value.map(String) : []
  } catch {
    return []
  }
}

const writeFavorites = (ids) => {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
    window.dispatchEvent(new Event(FAVORITES_EVENT))
  } catch {
    // Ignore localStorage failures and keep the UI usable.
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(readFavorites)

  useEffect(() => {
    const sync = () => setFavoriteIds(readFavorites())
    window.addEventListener('storage', sync)
    window.addEventListener(FAVORITES_EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(FAVORITES_EVENT, sync)
    }
  }, [])

  const toggleFavorite = (id) => {
    const next = favoriteIds.includes(String(id))
      ? favoriteIds.filter((favoriteId) => favoriteId !== String(id))
      : [...favoriteIds, String(id)]
    setFavoriteIds(next)
    writeFavorites(next)
  }

  return { favoriteIds, toggleFavorite, isFavorite: (id) => favoriteIds.includes(String(id)) }
}