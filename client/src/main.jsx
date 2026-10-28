import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { SiteProvider } from './context/SiteContext'
import ErrorBoundary from './components/ErrorBoundary'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    if (import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch((error) => console.error('Service worker registration failed:', error))
      return
    }

    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(registrations.map((registration) => registration.unregister()))
    const cacheKeys = await caches.keys()
    await Promise.all(cacheKeys.map((key) => caches.delete(key)))
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <SiteProvider>
          <App />
        </SiteProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)