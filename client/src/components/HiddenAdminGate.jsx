import { lazy, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const NotFound = lazy(() => import('../pages/NotFound'))
const AdminRoute = lazy(() => import('./AdminRoute'))

// The admin area has no public URL. Only the SHA-256 hash of its secret path is
// stored here (the repository is public), so the path itself never appears in
// the source or in the shipped JavaScript. Every unknown URL is hashed and
// compared; anything that doesn't match, including /admin, gets the normal
// "page not found" page.
//
// To change the path: pick a new long random path, run
//   node -e "console.log(require('crypto').createHash('sha256').update('/your-new-path').digest('hex'))"
// and replace the hash below.
const ADMIN_PATH_HASH = '9ebe0888ef238b4de83301ed509c4c911f792f1d3607c1e81249fa091718273d'

const sha256Hex = async (text) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

const normalizePath = (pathname) => (pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname)

export default function HiddenAdminGate() {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)
  const [result, setResult] = useState({ path: null, isAdmin: false })

  useEffect(() => {
    let cancelled = false
    const check = globalThis.crypto?.subtle ? sha256Hex(path) : Promise.resolve('')
    check
      .then((hash) => { if (!cancelled) setResult({ path, isAdmin: hash === ADMIN_PATH_HASH }) })
      .catch(() => { if (!cancelled) setResult({ path, isAdmin: false }) })
    return () => { cancelled = true }
  }, [path])

  // Hashing takes a millisecond or two; render nothing until it's done so the
  // "not found" page doesn't flash on the admin URL.
  if (result.path !== path) return null
  return result.isAdmin ? <AdminRoute /> : <NotFound />
}
