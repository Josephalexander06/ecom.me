import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../ui/ProductCard';

const DealsSection = ({ products = [] }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const headerTimeLeft = useMemo(() => {
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = Math.max(endOfDay.getTime() - now, 0);
    return {
      h: Math.floor(diff / (1000 * 60 * 60)),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60)
    };
  }, [now]);

  const dealMeta = useMemo(
    () =>
      products.map((product, idx) => {
        const idSeed = String(product._id || product.id || idx)
          .split('')
          .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const claimed = 35 + (idSeed % 58); // 35% - 92%
        const hoursFromNow = 2 + (idSeed % 20); // 2h - 21h
        const minsFromNow = 5 + (idSeed % 50); // 5m - 54m
        const endAt = Date.now() + (hoursFromNow * 60 + minsFromNow) * 60 * 1000;
        return { productId: product._id || product.id || idx, claimed, endAt };
      }),
    [products]
  );

  const fmt2 = (n) => String(Math.max(0, n)).padStart(2, '0');
  const getDealTimeLeft = (endAt) => {
    const diff = Math.max(endAt - now, 0);
    return {
      h: Math.floor(diff / (1000 * 60 * 60)),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60)
    };
  };

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

        <div className="flex items-center gap-6 bg-white p-5 rounded-pro shadow-premium border border-border-default">
          <div className="flex items-end gap-3">
            <div className="text-center min-w-[64px]">
              <div className="text-2xl font-display font-bold text-text-primary">{fmt2(headerTimeLeft.h)}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Hours</div>
            </div>
            <span className="text-xl font-bold text-text-muted pb-4">:</span>
            <div className="text-center min-w-[64px]">
              <div className="text-2xl font-display font-bold text-text-primary">{fmt2(headerTimeLeft.m)}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Min</div>
            </div>
            <span className="text-xl font-bold text-text-muted pb-4">:</span>
            <div className="text-center min-w-[64px]">
              <div className="text-2xl font-display font-bold text-text-primary">{fmt2(headerTimeLeft.s)}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Sec</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Row */}
      <div className="relative">
        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-8 snap-x">
          {products.map((product, idx) => {
            const meta = dealMeta[idx];
            const left = getDealTimeLeft(meta?.endAt || now);
            return (
            <div key={product.id || product._id} className="w-[180px] md:w-[220px] flex-none snap-start">
              <ProductCard product={product} />
              
              {/* Deal Specific Meta */}
              <div className="mt-3 px-1">
                <div className="flex justify-between items-center text-caption font-bold text-text-secondary mb-1.5">
                  <span>{meta?.claimed || 0}% claimed</span>
                  <span className="text-warning">Ends in {fmt2(left.h)}:{fmt2(left.m)}:{fmt2(left.s)}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-tertiary rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${meta?.claimed || 0}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-warning" 
                  />
                </div>
              </div>
            </div>
          )})}
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
