import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './util/ScrollToTop'
import MobileBottomNav from './components/MobileBottomNav'

const Home = lazy(() => import('./pages/Home'))
const Collections = lazy(() => import('./pages/Collections'))
const FabricDetail = lazy(() => import('./pages/FabricDetail'))
const Favorites = lazy(() => import('./pages/Favorites'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const HiddenAdminGate = lazy(() => import('./components/HiddenAdminGate'))

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-page text-charcoal">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense
          fallback={
            <div className="page-loading" role="status" aria-label="Loading page">
              <span />
            </div>
          }
        >
          <Routes>
            <Route path="/"                element={<Home />} />
            <Route path="/collections"     element={<Collections />} />
            <Route path="/collections/:id" element={<FabricDetail />} />
            <Route path="/favorites"        element={<Favorites />} />
            <Route path="/about"           element={<About />} />
            <Route path="/contact"         element={<Contact />} />
            <Route path="/privacy"         element={<Privacy />} />
            {/* Unknown URLs show "not found"; the admin area lives at a secret path checked inside. */}
            <Route path="*"                element={<HiddenAdminGate />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}