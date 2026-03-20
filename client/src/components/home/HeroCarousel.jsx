import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeImage from '../ui/SafeImage';

const slides = [
  {
    id: 1,
    title: 'Performance-First Devices',
    subtitle: 'Flagship phones, wearables, and accessories curated for modern workflows.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2670&auto=format&fit=crop',
    link: '/products?category=Mobiles',
    cta: 'Explore Mobiles',
  },
  {
    id: 2,
    title: 'Studio Grade Audio',
    subtitle: 'Immersive sound systems built for focus, creation, and entertainment.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2574&auto=format&fit=crop',
    link: '/products?category=Electronics',
    cta: 'Shop Audio',
  },
  {
    id: 3,
    title: 'Next Season Fashion',
    subtitle: 'Clean silhouettes and premium essentials with faster doorstep delivery.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2669&auto=format&fit=crop',
    link: '/products?category=Fashion',
    cta: 'View Collection',
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="panel relative overflow-hidden min-h-[420px] md:min-h-[520px] group">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <SafeImage
            src={slides[current].image}
            alt={slides[current].title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/45 to-slate-900/10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full min-h-[420px] md:min-h-[520px] p-6 md:p-10 lg:p-14 flex items-end">
        <motion.div
          key={`content-${slides[current].id}`}
          initial={{ y: 22, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center rounded-pill border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
            New Curated Drop
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl lg:text-6xl leading-[1.02] font-extrabold text-white text-balance">
            {slides[current].title}
          </h2>
          <p className="mt-4 max-w-xl text-sm md:text-lg text-slate-200 text-balance">
            {slides[current].subtitle}
          </p>
          <Link
            to={slides[current].link}
            className="mt-8 inline-flex items-center gap-2 rounded-pill bg-white px-6 py-3 text-sm font-bold text-brand-primary hover:bg-slate-100 transition-colors"
          >
            {slides[current].cta}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      <div className="absolute top-1/2 inset-x-0 -translate-y-1/2 px-3 md:px-5 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="pointer-events-auto h-10 w-10 md:h-11 md:w-11 rounded-full border border-white/30 bg-slate-900/40 text-white grid place-items-center backdrop-blur-sm hover:bg-white hover:text-slate-900 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="pointer-events-auto h-10 w-10 md:h-11 md:w-11 rounded-full border border-white/30 bg-slate-900/40 text-white grid place-items-center backdrop-blur-sm hover:bg-white hover:text-slate-900 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 rounded-pill border border-white/20 bg-slate-900/25 px-3 py-2 backdrop-blur-sm flex items-center gap-2">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-pill transition-all ${idx === current ? 'w-8 bg-white' : 'w-2 bg-white/45 hover:bg-white/70'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
