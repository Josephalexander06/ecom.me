import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useIsDesktop from '../../hooks/useIsDesktop';

const categories = ['Neural Links', 'Retinal Inserts', 'Haptic Gear', 'Cognitive', 'Accessories'];

const FilterSidebar = ({ isOpen, onClose }) => {
  const isDesktop = useIsDesktop();

  const variants = {
    initial: isDesktop ? { x: '-100%' } : { y: '100%' },
    animate: isDesktop ? { x: 0 } : { y: 0 },
    exit: isDesktop ? { x: '-100%' } : { y: '100%' }
  };

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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[110]"
          />
          
          {/* Sidebar / Bottom Sheet */}
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed z-[120] glass p-8 md:p-10 flex flex-col ${
              isDesktop 
                ? 'top-0 left-0 h-full w-full max-w-sm' 
                : 'bottom-0 left-0 w-full h-[70vh] rounded-t-[3rem]'
            }`}
          >
            <div className="flex items-center justify-between mb-8 md:mb-12">
              <h2 className="font-display text-text-main italic">Filters</h2>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full hover:bg-black/5 transition-colors text-text-main flex items-center justify-center border border-black/5"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-10 overflow-y-auto pr-2 no-scrollbar">
              {/* Categories */}
              <div>
                <h3 className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.3em] mb-6 font-bold">Device Type</h3>
                <div className="space-y-4">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-4 cursor-pointer group">
                      <div className="w-6 h-6 border border-black/10 rounded-lg flex items-center justify-center group-hover:border-accent-primary transition-colors bg-white">
                        <div className="w-3 h-3 bg-accent-primary rounded-md opacity-0 group-has-[:checked]:opacity-100 transition-opacity shadow-[0_0_10px_var(--accent-primary)]" />
                      </div>
                      <input type="checkbox" className="hidden" />
                      <span className="text-sm font-body text-text-muted group-hover:text-text-main transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.3em] mb-6 font-bold">Data Credit Range</h3>
                <div className="px-2">
                  <input type="range" className="w-full accent-accent-primary bg-black/5 h-2 rounded-lg appearance-none cursor-pointer" />
                  <div className="flex justify-between mt-4 font-mono text-[10px] text-text-muted">
                    <span>$0</span>
                    <span>$5000+</span>
                  </div>
                </div>
              </div>

              {/* Reset */}
              <button className="w-full py-5 rounded-2xl border border-black/10 text-text-main font-display text-[10px] tracking-widest uppercase hover:bg-black/5 transition-all mt-4">
                Reset Parameters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSidebar;
