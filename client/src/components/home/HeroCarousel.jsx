import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80',
    title: 'Precision Performance',
    subtitle: 'Explore the new Aether Z-Series Sneakers.',
    button: 'Shop Footwear',
  },
  {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80',
    title: 'Next-Gen Wearables',
    subtitle: 'Smart tech that moves at the speed of life.',
    button: 'View Watches',
  },
  {
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80',
    title: 'Acoustic Perfection',
    subtitle: 'Studio quality sound in your pocket.',
    button: 'Discover Audio',
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <div className="relative h-[200px] md:h-[380px] w-full overflow-hidden bg-surface-secondary">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <img 
            src={banners[current].image} 
            alt={banners[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-[1400px] mx-auto text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-h2 md:text-[3rem] font-display font-bold leading-tight mb-2">
                {banners[current].title}
              </h2>
              <p className="text-body md:text-xl font-body text-white/80 mb-6 max-w-lg">
                {banners[current].subtitle}
              </p>
              <button className="bg-white text-brand-primary px-8 py-3 rounded-pill font-bold hover:scale-105 transition-transform">
                {banners[current].button}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all invisible md:visible"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all invisible md:visible"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-6' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
