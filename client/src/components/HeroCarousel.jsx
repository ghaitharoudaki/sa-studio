import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
  }, []);

  const pauseTimer = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  const goTo = useCallback((i) => {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => {
    goTo(index + 1);
    startTimer();
  }, [index, goTo, startTimer]);

  const prev = useCallback(() => {
    goTo(index - 1);
    startTimer();
  }, [index, goTo, startTimer]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    pauseTimer();
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) prev();
    else if (delta < -50) next();
    touchStartX.current = null;
    startTimer();
  };

  const slide = SLIDES[index];

  return (
    <section
      className="relative w-full h-[calc(100vh-80px)] min-h-[500px] overflow-hidden bg-black"
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <picture className="block w-full h-full">
            <source srcSet={slide.webp} type="image/webp" />
            <img
              src={slide.jpg}
              alt=""
              className="w-full h-full object-cover block"
              style={{ objectPosition: slide.objectPosition }}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </picture>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(13,12,10,0.65) 0%, rgba(13,12,10,0.3) 50%, rgba(13,12,10,0.5) 100%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-start justify-center text-left px-6 sm:px-12 md:px-20 max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.h1
            key={slide.id + '-headline'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5 }}
            className="font-serif text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight"
          >
            {slide.headline}
          </motion.h1>
        </AnimatePresence>

        <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 justify-start">
          <Link
            to="/collections"
            className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[var(--green,#1F3D2E)] text-white text-xs sm:text-sm tracking-wide uppercase hover:opacity-90 transition"
          >
            Explore Collections
          </Link>
          <Link
            to="/about"
            className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full border border-white/60 text-white text-xs sm:text-sm tracking-wide uppercase hover:bg-white/10 transition"
          >
            View Our Story
          </Link>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-6 sm:left-12 md:left-20 z-10 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              goTo(i);
              startTimer();
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 text-white items-center justify-center hover:bg-black/50 transition"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 text-white items-center justify-center hover:bg-black/50 transition"
      >
        ›
      </button>
    </section>
  );
}