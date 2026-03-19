import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: "The All-New iPhone 15 Pro",
    subtitle: "Titanium. So strong. So light. So Pro.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=2670&auto=format&fit=crop",
    link: "/products?q=iphone",
    cta: "Buy Now",
    align: "left",
    theme: "dark"
  },
  {
    id: 2,
    title: "Sony WH-1000XM5",
    subtitle: "Your world. Nothing else.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2788&auto=format&fit=crop",
    link: "/products?category=Electronics",
    cta: "Shop Audio",
    align: "right",
    theme: "light"
  },
  {
    id: 3,
    title: "Summer Wardrobe Reset",
    subtitle: "Up to 40% off on premium lifestyle apparel.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2670&auto=format&fit=crop",
    link: "/products?category=Fashion",
    cta: "Explore Fashion",
    align: "center",
    theme: "dark"
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 second auto-advance
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-surface-secondary group/carousel">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image with Zoom Effect */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6 }}
              src={slides[current].image} 
              alt={slides[current].title}
              className="w-full h-full object-cover object-center"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${
              slides[current].theme === 'dark' 
                ? 'from-black/70 via-black/40 to-transparent' 
                : 'from-white/40 via-transparent to-transparent'
            }`} />
          </div>

          {/* Content Wrapper */}
          <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center">
            <div className={`w-full max-w-2xl ${
              slides[current].align === 'center' ? 'mx-auto text-center' : 
              slides[current].align === 'right' ? 'ml-auto text-right' : 'text-left'
            }`}>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                 <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-4 ${
                   slides[current].theme === 'dark' ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-brand-primary/10 text-brand-primary'
                 }`}>
                   Featured Arrival
                 </span>
              </motion.div>

              <motion.h2 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className={`text-h1 md:text-[64px] font-display font-black leading-[1.05] tracking-tight mb-6 ${slides[current].theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {slides[current].title}
              </motion.h2>

              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className={`text-body md:text-h3 font-medium mb-10 opacity-90 ${slides[current].theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
              >
                {slides[current].subtitle}
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={slides[current].align === 'center' ? 'flex justify-center' : slides[current].align === 'right' ? 'flex justify-end' : ''}
              >
                <Link 
                  to={slides[current].link}
                  className={`group/btn inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold transition-all shadow-2xl hover:scale-105 active:scale-95 ${
                    slides[current].theme === 'dark' 
                      ? 'bg-white text-brand-primary hover:shadow-white/20' 
                      : 'bg-brand-primary text-white hover:bg-brand-hover hover:shadow-brand-primary/20'
                  }`}
                >
                  {slides[current].cta} 
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows (Modern Style) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 md:px-8 flex justify-between items-center pointer-events-none opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
        <button 
          onClick={prev}
          className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-brand-primary transition-all pointer-events-auto shadow-2xl"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={28} />
        </button>
        <button 
          onClick={next}
          className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white hover:text-brand-primary transition-all pointer-events-auto shadow-2xl"
          aria-label="Next Slide"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Slide Indicators (Modern Pills) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 p-2 rounded-full backdrop-blur-md bg-black/10 border border-white/10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-500 rounded-full h-1.5 ${current === idx ? 'w-10 bg-brand-primary' : 'w-2 bg-white/40 hover:bg-white'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
