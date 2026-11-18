import { useCallback, useEffect, useRef, useState } from 'react'
import { useSite } from '../context/SiteContext'
import { useModalBehavior } from '../hooks/useModalBehavior'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.5
const SWIPE_THRESHOLD = 50

const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
const roundButton = 'rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center disabled:opacity-40'

function Lightbox({ images, initialIndex = 0, onClose, fabricName, fabricCollection }) {
  const { t } = useSite()
  const [currentIndex, setCurrentIndex] = useState(() => Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1)))
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const pinchStart = useRef(null)
  const swipeStartX = useRef(null)
  const closeRef = useRef(null)

  useModalBehavior(onClose, closeRef)

  const resetZoom = useCallback(() => {
    setZoom(MIN_ZOOM)
    setPosition({ x: 0, y: 0 })
  }, [])

  const goTo = useCallback((step) => {
    setCurrentIndex((prev) => (prev + step + images.length) % images.length)
    resetZoom()
  }, [images.length, resetZoom])

  const zoomBy = useCallback((delta) => {
    setZoom((prev) => {
      const next = clampZoom(prev + delta)
      if (next === MIN_ZOOM) setPosition({ x: 0, y: 0 })
      return next
    })
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') goTo(-1)
      else if (event.key === 'ArrowRight') goTo(1)
      else if (event.key === '+' || event.key === '=') zoomBy(ZOOM_STEP)
      else if (event.key === '-' || event.key === '_') zoomBy(-ZOOM_STEP)
      else if (event.key === '0') resetZoom()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [goTo, zoomBy, resetZoom])

  // Pan (mouse, pen, or one finger) while zoomed in.
  const handlePointerDown = (event) => {
    if (zoom === MIN_ZOOM || pinchStart.current) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
    dragStart.current = { x: event.clientX - position.x * zoom, y: event.clientY - position.y * zoom }
  }
  const handlePointerMove = (event) => {
    if (!isDragging) return
    // translate() sits inside scale(), so it is magnified by zoom: divide it back out
    // so the photo tracks the pointer 1:1.
    setPosition({
      x: (event.clientX - dragStart.current.x) / zoom,
      y: (event.clientY - dragStart.current.y) / zoom,
    })
  }
  const endDrag = () => setIsDragging(false)

  // Pinch to zoom and swipe to change image (touch only).
  const handleTouchStart = (event) => {
    if (event.touches.length === 2) {
      const [a, b] = event.touches
      pinchStart.current = { distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), zoom }
      swipeStartX.current = null
    } else if (event.touches.length === 1 && zoom === MIN_ZOOM) {
      swipeStartX.current = event.touches[0].clientX
    }
  }
  const handleTouchMove = (event) => {
    if (event.touches.length !== 2 || !pinchStart.current) return
    const [a, b] = event.touches
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    setZoom(clampZoom(pinchStart.current.zoom * (distance / pinchStart.current.distance)))
  }
  const handleTouchEnd = (event) => {
    if (event.touches.length < 2) pinchStart.current = null
    if (swipeStartX.current !== null && zoom === MIN_ZOOM && images.length > 1) {
      const diff = swipeStartX.current - event.changedTouches[0].clientX
      if (Math.abs(diff) > SWIPE_THRESHOLD) goTo(diff > 0 ? 1 : -1)
    }
    swipeStartX.current = null
  }

  if (!images.length) return null
  const currentImage = images[currentIndex]

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`${fabricName} gallery`}
    >
      <button ref={closeRef} type="button" onClick={onClose} className={`absolute top-4 right-4 z-20 h-11 w-11 ${roundButton}`} aria-label={t('close')}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      {images.length > 1 && (
        <>
          <button type="button" onClick={() => goTo(-1)} className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 ${roundButton}`} aria-label="Previous image">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" onClick={() => goTo(1)} className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 ${roundButton}`} aria-label="Next image">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
          <p className="absolute top-4 left-4 z-20 bg-white/10 rounded-full px-4 py-2 text-white text-sm" aria-live="polite">
            {currentIndex + 1} / {images.length}
          </p>
        </>
      )}

      {/* Clicking the dark area around the photo closes the gallery. */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden p-4 sm:p-16"
        style={{ touchAction: 'none' }}
        onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={currentImage}
          src={currentImage}
          alt={`${fabricName} ${fabricCollection || ''}, image ${currentIndex + 1} of ${images.length}`}
          className={`max-w-full max-h-full object-contain select-none ${zoom > MIN_ZOOM ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'}`}
          style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}
          draggable={false}
          onDoubleClick={() => (zoom > MIN_ZOOM ? resetZoom() : zoomBy(1))}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
        <button type="button" onClick={() => zoomBy(-ZOOM_STEP)} disabled={zoom === MIN_ZOOM} className={`h-10 w-10 ${roundButton} bg-transparent`} aria-label="Zoom out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 12h14" /></svg>
        </button>
        <span className="text-white text-sm min-w-[3rem] text-center tabular-nums">{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => zoomBy(ZOOM_STEP)} disabled={zoom === MAX_ZOOM} className={`h-10 w-10 ${roundButton} bg-transparent`} aria-label="Zoom in">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <button type="button" onClick={resetZoom} disabled={zoom === MIN_ZOOM} className={`h-10 w-10 ${roundButton} bg-transparent`} aria-label="Reset zoom">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
        </button>
      </div>
    </div>
  )
}

export default Lightbox
