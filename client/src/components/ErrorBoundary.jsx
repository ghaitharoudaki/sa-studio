import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('SA Studio render error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-page px-6 text-center text-charcoal">
          <div>
            <h1 className="font-serif text-4xl">SA Studio</h1>
            <p className="mt-4 text-sm text-charcoal-light">Something went wrong while loading this page. Please refresh and try again.</p>
            <button type="button" className="primary-cta mt-6 min-h-[44px] px-6 py-3 text-xs uppercase tracking-[0.12em]" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
