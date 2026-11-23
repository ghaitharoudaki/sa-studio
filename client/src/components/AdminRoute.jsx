import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSite } from '../context/SiteContext'

// Only downloaded once the server has confirmed the visitor is an admin.
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'))

const IDLE_TIMEOUT_MS = 30 * 60 * 1000
const LOCKOUT_KEY = 'sa-studio-admin-login'
const FREE_ATTEMPTS = 5
const BASE_LOCKOUT_MS = 30 * 1000
const MAX_LOCKOUT_MS = 15 * 60 * 1000
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart']

// Client-side brake on password guessing. Supabase Auth also rate-limits on the
// server; this just stops a browser from hammering the endpoint.
const readLockout = () => {
  try {
    const value = JSON.parse(localStorage.getItem(LOCKOUT_KEY) || '{}')
    return { failures: Number(value.failures) || 0, lockedUntil: Number(value.lockedUntil) || 0 }
  } catch {
    return { failures: 0, lockedUntil: 0 }
  }
}
const writeLockout = (value) => {
  try {
    if (value) localStorage.setItem(LOCKOUT_KEY, JSON.stringify(value))
    else localStorage.removeItem(LOCKOUT_KEY)
  } catch { /* storage unavailable: the server-side limit still applies */ }
}
const recordFailure = () => {
  const failures = readLockout().failures + 1
  const extra = failures - FREE_ATTEMPTS
  const lockedUntil = extra >= 0 ? Date.now() + Math.min(MAX_LOCKOUT_MS, BASE_LOCKOUT_MS * 2 ** extra) : 0
  writeLockout({ failures, lockedUntil })
  return lockedUntil
}

// Ask the database, not the cached token, whether this user is still an admin
// (a revoked role takes effect immediately instead of when the token expires).
const confirmAdmin = async () => {
  const { data, error } = await supabase.rpc('is_admin')
  return !error && data === true
}

function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow, noarchive'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])
}

function AdminLogin({ notice }) {
  const { t } = useSite()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lockedUntil, setLockedUntil] = useState(() => readLockout().lockedUntil)
  const [now, setNow] = useState(() => Date.now())

  const secondsLeft = Math.max(0, Math.ceil((lockedUntil - now) / 1000))
  useEffect(() => {
    if (!secondsLeft) return undefined
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [secondsLeft])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (readLockout().lockedUntil > Date.now()) return

    setSubmitting(true)
    setError('')
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setSubmitting(false)

    if (signInError) {
      setPassword('')
      setLockedUntil(recordFailure())
      setNow(Date.now())
      setError(t('unableToSignIn'))
      return
    }
    writeLockout(null)
  }

  const message = secondsLeft
    ? t('tooManyAttempts').replace('{seconds}', secondsLeft)
    : error || notice

  return (
    <div className="px-6 lg:px-16 py-24 max-w-md mx-auto">
      <p className="eyebrow mb-4">{t('privateArea')}</p>
      <h1 className="font-serif text-5xl font-light text-charcoal mb-10">{t('adminSignIn')}</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="block text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2">{t('email')}</span>
          <input
            required
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full min-h-[44px] border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest"
          />
        </label>
        <label className="block">
          <span className="block text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2">{t('password')}</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full min-h-[44px] border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest"
          />
        </label>
        <button
          type="submit"
          disabled={submitting || secondsLeft > 0}
          className="min-h-[44px] px-8 py-3 bg-forest text-white text-[11px] tracking-[0.2em] uppercase hover:bg-forest-light transition-colors disabled:opacity-60"
        >
          {submitting ? t('signingIn') : t('signIn')}
        </button>
        {message && <p className="text-sm text-charcoal-light" role="alert">{message}</p>}
      </form>
    </div>
  )
}

export default function AdminRoute() {
  const navigate = useNavigate()
  const { t } = useSite()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  // Result of the server-side admin check, tied to the user it was made for.
  const [verified, setVerified] = useState({ userId: null, isAdmin: false })
  const [noticeKey, setNoticeKey] = useState('')
  useNoIndex()

  useEffect(() => {
    if (!supabase) return undefined

    let mounted = true
    supabase.auth.getSession().then(async ({ data }) => {
      let current = data.session
      if (current) {
        const { data: refreshed } = await supabase.auth.refreshSession()
        current = refreshed?.session ?? null
      }
      if (mounted) {
        setSession(current)
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  // Re-check admin rights with the server whenever the signed-in user changes.
  const userId = session?.user?.id
  useEffect(() => {
    if (!userId) return undefined
    let cancelled = false
    confirmAdmin().then((isAdmin) => {
      if (cancelled) return
      setVerified({ userId, isAdmin })
      if (!isAdmin) {
        setNoticeKey('noAdminAccess')
        supabase.auth.signOut()
      }
    })
    return () => { cancelled = true }
  }, [userId])

  const isAdmin = Boolean(userId) && verified.userId === userId && verified.isAdmin

  // Sign out after a period without any interaction.
  useEffect(() => {
    if (!isAdmin) return undefined
    const expire = () => {
      setNoticeKey('sessionExpired')
      supabase.auth.signOut()
    }
    let timer = setTimeout(expire, IDLE_TIMEOUT_MS)
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(expire, IDLE_TIMEOUT_MS)
    }
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, reset, { passive: true }))
    return () => {
      clearTimeout(timer)
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, reset))
    }
  }, [isAdmin])

  if (!supabase) {
    return <Navigate to="/" replace />
  }

  const checking = <div className="px-6 lg:px-16 py-24 text-sm text-charcoal-light">{t('checkingAccess')}</div>

  if (loading) return checking
  if (!session) return <AdminLogin notice={noticeKey ? t(noticeKey) : ''} />
  if (!isAdmin) return checking

  return (
    <>
      <div className="fixed top-[88px] right-6 lg:right-16 z-30">
        <button
          type="button"
          onClick={async () => {
            await supabase.auth.signOut()
            navigate('/')
          }}
          className="text-[10px] tracking-[0.2em] uppercase text-charcoal-light hover:text-forest transition-colors"
        >
          {t('signOut')}
        </button>
      </div>
      <Suspense fallback={checking}>
        <AdminDashboard />
      </Suspense>
    </>
  )
}
