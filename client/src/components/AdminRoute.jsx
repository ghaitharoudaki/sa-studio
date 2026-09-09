import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AdminDashboard from '../pages/AdminDashboard'
import { supabase } from '../lib/supabase'
import { useSite } from '../context/SiteContext'

function AdminLogin() {
  const { t } = useSite()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)

    if (signInError) {
      setError(t('unableToSignIn'))
    }
  }

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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full min-h-[44px] border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="min-h-[44px] px-8 py-3 bg-forest text-white text-[11px] tracking-[0.2em] uppercase hover:bg-forest-light transition-colors disabled:opacity-60"
        >
          {submitting ? t('signingIn') : t('signIn')}
        </button>
        {error && <p className="text-sm text-charcoal-light" role="alert">{error}</p>}
      </form>
    </div>
  )
}

export default function AdminRoute() {
  const navigate = useNavigate()
  const { t } = useSite()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return undefined

    let mounted = true
    supabase.auth.getSession().then(async ({ data }) => {
      let session = data.session
      if (session) {
        const { data: refreshed } = await supabase.auth.refreshSession()
        if (refreshed?.session) session = refreshed.session
      }
      if (mounted) {
        setSession(session)
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

  if (!supabase) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return <div className="px-6 lg:px-16 py-24 text-sm text-charcoal-light">{t('checkingAccess')}</div>
  }

  if (!session) {
    return <AdminLogin />
  }

  const role = session.user.app_metadata?.role
  if (role !== 'admin') {
    supabase.auth.signOut()
    return <Navigate to="/" replace />
  }

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
      <AdminDashboard />
    </>
  )
}
