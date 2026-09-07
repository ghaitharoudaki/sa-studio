import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Admin from '../pages/Admin'
import { supabase } from '../lib/supabase'

function AdminLogin() {
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
      setError('Unable to sign in with those details.')
    }
  }

  return (
    <div className="pt-[72px] px-6 lg:px-16 py-24 max-w-md mx-auto">
      <p className="eyebrow mb-4">Private area</p>
      <h1 className="font-serif text-5xl font-light text-charcoal mb-10">Admin sign in</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="block text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full min-h-[44px] border border-cream-dark bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-forest"
          />
        </label>
        <label className="block">
          <span className="block text-[10px] tracking-[0.2em] uppercase text-charcoal-light mb-2">Password</span>
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
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
        {error && <p className="text-sm text-charcoal-light" role="alert">{error}</p>}
      </form>
    </div>
  )
}

export default function AdminRoute() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return undefined

    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session)
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
    return <div className="pt-[72px] px-6 lg:px-16 py-24 text-sm text-charcoal-light">Checking access...</div>
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
          Sign out
        </button>
      </div>
      <Admin />
    </>
  )
}
