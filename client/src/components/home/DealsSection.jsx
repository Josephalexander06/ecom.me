import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';
import FlipClock from './FlipClock';

const DealsSection = ({ products = [] }) => {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;

      setTimeLeft({
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-warning-light px-3 py-1 rounded-full text-warning text-caption font-bold mb-3 border border-warning/10">
            <Clock size={14} /> DEALS OF THE DAY
          </div>
          <h2 className="text-h2 font-display text-text-primary leading-tight">
            Limited Time Offers
          </h2>
        </div>

        {/* Flip Clock */}
        <div className="flex items-center gap-6 bg-white p-5 rounded-pro shadow-premium border border-border-default">
          <FlipClock />
        </div>
      </div>

      {/* Product Row */}
      <div className="relative">
        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-8 snap-x">
          {products.map((product) => (
            <div key={product.id || product._id} className="min-w-[240px] md:min-w-[280px] snap-start">
              <ProductCard product={product} />
              
              {/* Deal Specific Meta */}
              <div className="mt-3 px-1">
                <div className="flex justify-between items-center text-caption font-bold text-text-secondary mb-1.5">
                  <span>67% claimed</span>
                  <span className="text-warning">Ends in {timeLeft.h}h</span>
                </div>
                <div className="h-1.5 w-full bg-surface-tertiary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '67%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-warning" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Scroll End Hint */}
        <Link 
          to="/products?sort=deals"
          className="absolute right-0 top-[150px] translate-x-1/2 w-16 h-16 bg-white border border-border-default rounded-full shadow-lg flex items-center justify-center text-brand-primary hover:scale-110 transition-transform z-10"
        >
          <ChevronRight size={32} />
        </Link>
      </div>
    </div>
  );
};

export default DealsSection;
