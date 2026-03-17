import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductRow = ({ title, subtitle, products }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-bg-primary overflow-hidden relative">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <h2 className="text-white font-display text-2xl font-black uppercase tracking-tighter italic">{title}</h2>
          {subtitle && <p className="text-text-muted text-[10px] mt-1 font-bold uppercase tracking-widest opacity-60 font-body">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => scroll('left')}
             className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all shadow-xl backdrop-blur-md"
           >
             <ChevronLeft size={24} />
           </button>
           <button 
             onClick={() => scroll('right')}
             className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-all shadow-xl backdrop-blur-md"
           >
             <ChevronRight size={24} />
           </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex flex-row flex-nowrap gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-8"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {/* Placeholder for scroll indication */}
        <div className="min-w-[150px] shrink-0" />
      </div>
    </section>
  );
};

export default ProductRow;
