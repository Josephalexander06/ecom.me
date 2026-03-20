import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SafeImage from './SafeImage';

const banners = [
  {
    id: 1,
    title: "SYNAPSE-X NEURAL LINK",
    subtitle: "Overclock your consciousness. The next generation of cognitive interfaces has arrived.",
    cta: "Shop Now",
    image: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/hero_neural_link_banner_1773542276045.png",
    color: "from-[#10ced1]/10 to-transparent"
  },
  {
    id: 2,
    title: "IRIS PRO RETINAL INSERTS",
    subtitle: "See beyond the visible spectrum. 16K AR overlay with zero-latency synchronization.",
    cta: "Explore Iris",
    image: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/hero_retinal_insert_banner_1773542294287.png",
    color: "from-[#7000ff]/10 to-transparent"
  },
  {
    id: 3,
    title: "SOMATIC HAPTIC ENSEMBLE",
    subtitle: "Feel every pixel. Full-body feedback for immersive neural matrix navigation.",
    cta: "Order Gear",
    image: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/hero_haptic_suit_banner_1773542309537.png",
    color: "from-[#fb641b]/10 to-transparent"
  }
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[300px] md:h-[450px] overflow-hidden bg-white mb-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full flex items-center justify-between"
        >
          <SafeImage 
            src={banners[currentIndex].image} 
            alt={banners[currentIndex].title}
            className="w-full h-full object-contain"
          />

          {/* Content Overlays removed for cleaner look, Flipkart uses full banner images usually or very simple text. I'll make the text simpler and overlay it carefully if needed, but for now let's just use the banner image and navigational elements. Actually, let's keep simple overlay text but style it cleanly. */}
          <div className="absolute inset-y-0 left-0 z-20 flex flex-col justify-center px-10 md:px-20 max-w-2xl bg-gradient-to-r from-white/90 via-white/50 to-transparent">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h2 className="text-text-main font-display text-3xl md:text-5xl font-bold mb-3 tracking-tight">
                {banners[currentIndex].title}
              </h2>
              <p className="text-text-muted text-sm md:text-lg mb-6 max-w-lg font-body">
                {banners[currentIndex].subtitle}
              </p>
              <button className="w-fit bg-accent-secondary text-white font-bold py-3 px-8 rounded-sm uppercase tracking-wider text-[10px] md:text-xs hover:brightness-110 transition-all shadow-md">
                {banners[currentIndex].cta}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 py-8 px-4 bg-white/50 hover:bg-white text-text-main transition-all rounded-r-md shadow-sm hidden md:block"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 py-8 px-4 bg-white/50 hover:bg-white text-text-main transition-all rounded-l-md shadow-sm hidden md:block"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 transition-all duration-700 rounded-full ${idx === currentIndex ? 'w-16 bg-accent-primary' : 'w-4 bg-text-dim/20'}`}
          />
        ))}
      </div>

      {/* Edge Fades for scroll indication */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/40 to-transparent z-10 pointer-events-none hidden lg:block" />
    </section>
  );
};

export default Hero;
