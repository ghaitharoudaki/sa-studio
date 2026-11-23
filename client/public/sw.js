const CACHE_NAME = 'sa-studio-v3'
const APP_SHELL = ['/', '/favicon.svg']

// Pages are fetched network-first so a new deploy (including security fixes)
// reaches returning visitors straight away; the cached shell is only an
// offline fallback. Fingerprinted build assets and static images are safe to
// serve cache-first. Pages (including the admin area) are never stored, and
// cross-origin requests (Supabase API, auth, storage) are left alone.
const isCacheableAsset = (url) => url.pathname.startsWith('/assets/') || url.pathname.startsWith('/images/')

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/')))
    return
  }

  if (!isCacheableAsset(url)) return

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
      }
      return response
    })),
  )
})
