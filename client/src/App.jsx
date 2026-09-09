import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const Home = lazy(() => import('./pages/Home'))
const Collections = lazy(() => import('./pages/Collections'))
const FabricDetail = lazy(() => import('./pages/FabricDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminRoute = lazy(() => import('./components/AdminRoute'))

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-page text-charcoal">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="px-6 py-24 text-center text-sm text-charcoal-light">Loading...</div>}>
          <Routes>
            <Route path="/"                element={<Home />} />
            <Route path="/collections"     element={<Collections />} />
            <Route path="/collections/:id" element={<FabricDetail />} />
            <Route path="/about"           element={<About />} />
            <Route path="/contact"         element={<Contact />} />
            <Route path="/privacy"         element={<Privacy />} />
            <Route path="/admin"           element={<AdminRoute />} />
            <Route path="*"                element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}