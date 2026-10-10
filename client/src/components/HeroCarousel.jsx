import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 'tiger',
    jpg: '/images/hero/hero-tiger.jpg',
    webp: '/images/hero/hero-tiger.webp',
    headline: 'Wallpaper & Wallpanels, Crafted for the Senses',
    objectPosition: 'center 30%',
  },
  {
    id: 'sofa',
    jpg: '/images/hero/hero-sofa.jpg',
    webp: '/images/hero/hero-sofa.webp',
    headline: 'Prime, Unbeatable Fabrics for Every Interior',
    objectPosition: 'center 40%',
  },
  {
    id: 'curtain',
    jpg: '/images/hero/hero-curtain.jpg',
    webp: '/images/hero/hero-curtain.webp',
    headline: 'Curtains That Transform Your Windows into Soft Light & Elegance',
    objectPosition: 'center 35%',
  },
  {
    id: 'border',
    jpg: '/images/hero/hero-border.jpg',
    webp: '/images/hero/hero-border.webp',
    headline: 'Borders for your curtains and cushions.',
    objectPosition: 'center 50%',
  },
  {
    id: 'outdoor',
    jpg: '/images/hero/hero-outdoor.jpg',
    webp: '/images/hero/hero-outdoor.webp',
    headline: 'Outdoor Fabrics Built for Sun, Wind & Effortless Style',
    objectPosition: 'center 45%',
  },
];

const AUTOPLAY_MS = 6000;

function Chevron({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={direction === 'left' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
    </svg>
  );
}

export default function HeroCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Users who prefer reduced motion start paused; anyone can pause/play
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(null);

  const goTo = useCallback((i) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  // Preload all slides so later transitions never fade into an empty frame
  useEffect(() => {
    SLIDES.slice(1).forEach((s) => {
      const img = new Image();
      img.src = s.webp;
    });
  }, []);

  // Autoplay; `index` dependency restarts the timer after any manual navigation
  useEffect(() => {
    if (!isPlaying || isHovered) return undefined;
    const id = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, isPlaying, isHovered, next]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  };

  const slide = SLIDES[index];
  const fade = prefersReducedMotion ? 0 : 0.9;

  return (
    <section
      className="hero-carousel relative w-full overflow-hidden bg-black"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsHovered(false); }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >
      <AnimatePresence mode="sync" initial={false}>
        <Motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: fade, ease: 'easeInOut' }, scale: { duration: prefersReducedMotion ? 0 : 7, ease: 'easeOut' } }}
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <picture className="block w-full h-full">
            <source srcSet={slide.webp} type="image/webp" />
            <img
              src={slide.jpg}
              alt=""
              className="w-full h-full object-cover block"
              style={{ objectPosition: slide.objectPosition }}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
            />
          </picture>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(13,12,10,0.72) 0%, rgba(13,12,10,0.38) 55%, rgba(13,12,10,0.2) 100%), linear-gradient(0deg, rgba(13,12,10,0.55) 0%, transparent 35%)',
            }}
          />
        </Motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-start justify-center text-left px-6 sm:px-16 md:px-24 max-w-4xl">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-white/75" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </p>
        <div aria-live={isPlaying ? 'off' : 'polite'} className="flex min-h-[3.3em] items-end text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          <AnimatePresence mode="wait" initial={false}>
            <Motion.h1
              key={slide.id + '-headline'}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
              className="hero-readable font-serif font-light text-white leading-[1.08] max-w-[18ch]"
            >
              {slide.headline}
            </Motion.h1>
          </AnimatePresence>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 justify-start">
          <Link
            to="/collections"
            className="inline-flex min-h-[46px] items-center px-7 rounded-full bg-[var(--green)] text-white text-xs sm:text-[13px] font-medium tracking-[0.14em] uppercase transition-colors hover:bg-[var(--primary-hover)]"
          >
            Explore Collections
          </Link>
          <Link
            to="/about"
            className="inline-flex min-h-[46px] items-center px-7 rounded-full border border-white/60 text-white text-xs sm:text-[13px] font-medium tracking-[0.14em] uppercase transition-colors hover:bg-white hover:text-[#1C1815]"
          >
            View Our Story
          </Link>
        </div>
      </div>

      {/* Indicators + play/pause */}
      <div className="absolute bottom-5 left-6 sm:left-16 md:left-24 z-10 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="hero-carousel-control !w-9 !h-9"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="5" width="3.5" height="14" rx="1" /><rect x="13.5" y="5" width="3.5" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
          )}
        </button>
        <div className="flex items-center">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}: ${s.headline}`}
              aria-current={i === index ? 'true' : undefined}
              className={`hero-dot ${i === index ? 'is-active' : ''}`}
            >
              <span />
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="hidden sm:flex absolute bottom-5 right-6 md:right-10 z-10 gap-2">
        <button type="button" onClick={prev} aria-label="Previous slide" className="hero-carousel-control">
          <Chevron direction="left" />
        </button>
        <button type="button" onClick={next} aria-label="Next slide" className="hero-carousel-control">
          <Chevron direction="right" />
        </button>
      </div>
    </section>
  );
}
