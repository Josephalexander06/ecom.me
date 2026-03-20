import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Info, Star } from 'lucide-react';
import SafeImage from '../ui/SafeImage';

const QuickView = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 w-full h-[85vh] bg-bg-deep border-t border-white/10 z-[210] rounded-t-[3rem] overflow-hidden flex flex-col md:flex-row shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-8 p-3 rounded-full glass hover:text-accent-primary transition-colors z-[220]"
            >
              <X size={24} />
            </button>

            {/* Left: Image Canvas */}
            <div className="w-full md:w-1/2 h-[40%] md:h-full bg-white/5 relative">
              <SafeImage
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-deep to-transparent" />
              <div className="absolute bottom-12 left-12">
                <span className="font-mono text-xs text-accent-primary tracking-[0.4em] uppercase mb-2 block">
                  {product.brand} // NEURAL CORE
                </span>
                <h2 className="text-4xl md:text-6xl font-display text-text-main">{product.name}</h2>
              </div>
            </div>

            {/* Right: Info Hub */}
            <div className="flex-1 p-12 md:p-20 overflow-y-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex text-accent-primary">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <span className="text-text-muted font-mono text-xs">4.9 Deep-Sync Score</span>
              </div>

              <p className="text-xl text-text-muted leading-relaxed font-body mb-12">
                {product.description}
              </p>

              <div className="grid grid-cols-2 gap-8 mb-16">
                <div>
                  <h4 className="text-[10px] font-mono text-accent-primary tracking-widest uppercase mb-2">Neural Latency</h4>
                  <span className="text-xl font-display text-text-main">0.2ms</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-mono text-accent-primary tracking-widest uppercase mb-2">Battery Cycle</h4>
                  <span className="text-xl font-display text-white text-text-main">168 Hours</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-black/10 pt-12">
                <div>
                  <span className="block text-xs font-mono text-text-muted uppercase mb-1">Total Logic Credits</span>
                  <span className="text-4xl font-mono text-text-main">${product.price}</span>
                </div>
                <button className="px-12 py-5 rounded-2xl bg-accent-primary text-black font-display font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.3)] flex items-center gap-4 text-xs">
                  <ShoppingCart size={18} />
                  Initialize Sync
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickView;
