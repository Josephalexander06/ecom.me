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
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden bg-surface-secondary">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={slides[current].image} 
              alt={slides[current].title}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark overlay for contrast if needed */}
            <div className={`absolute inset-0 ${slides[current].theme === 'dark' ? 'bg-black/40' : 'bg-black/10'}`}></div>
          </div>

          {/* Content Wrapper */}
          <div className="relative h-full max-w-[1400px] mx-auto px-6 md:px-12 flex items-center">
            <div className={`w-full max-w-2xl ${
              slides[current].align === 'center' ? 'mx-auto text-center' : 
              slides[current].align === 'right' ? 'ml-auto text-right' : 'text-left'
            }`}>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-h2 md:text-h1 font-display font-black leading-tight tracking-tight mb-4 ${slides[current].theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {slides[current].title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-body md:text-h3 font-medium mb-8 ${slides[current].theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
              >
                {slides[current].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={slides[current].align === 'center' ? 'flex justify-center' : slides[current].align === 'right' ? 'flex justify-end' : ''}
              >
                <Link 
                  to={slides[current].link}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold transition-all shadow-lg ${
                    slides[current].theme === 'dark' 
                      ? 'bg-white text-brand-primary hover:bg-gray-100' 
                      : 'bg-brand-primary text-white hover:bg-brand-hover'
                  }`}
                >
                  {slides[current].cta} <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm border border-border-default text-text-primary rounded-full flex items-center justify-center hover:bg-white transition-colors z-10 shadow-sm"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm border border-border-default text-text-primary rounded-full flex items-center justify-center hover:bg-white transition-colors z-10 shadow-sm"
        aria-label="Next Slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 Z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all rounded-full ${current === idx ? 'w-8 h-2 bg-brand-primary' : 'w-2 h-2 bg-white/60 hover:bg-white'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
