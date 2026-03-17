import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, X, ArrowRight, Command, Cpu, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAISearch from '../../hooks/useAISearch';

const AISearchOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { results, isSearching, error, performSearch } = useAISearch();
  const navigate = useNavigate();

  // Breathing animation variants
  const orbVariants = {
    idle: {
      scale: [1, 1.1, 1],
      opacity: [0.6, 0.9, 0.6],
      boxShadow: [
        '0 0 20px rgba(16,206,209,0.3)',
        '0 0 40px rgba(16,206,209,0.6)',
        '0 0 20px rgba(16,206,209,0.3)'
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    thinking: {
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSelectProduct = (id) => {
    setIsOpen(false);
    navigate(`/product/${id}`);
  };

  return (
    <>
      {/* Floating Orb Activator */}
      <motion.button
        variants={orbVariants}
        animate={isSearching ? "thinking" : "idle"}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center z-[150] shadow-[0_10px_30px_rgba(16,206,209,0.4)] md:w-20 md:h-20"
      >
        <Sparkles size={28} className="text-black" />
        <div className="absolute inset-0 rounded-full border-2 border-accent-primary animate-ping opacity-20" />
      </motion.button>

      {/* Spatial Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-bg-deep/80 backdrop-blur-2xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass p-8 md:p-12 rounded-[3.5rem] border border-black/5 bg-white/50 shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-accent-primary/10 blur-[80px]" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-accent-secondary/10 blur-[80px]" />

              <div className="relative">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center text-accent-primary">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl text-text-main italic">AETHER AI</h2>
                      <p className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Neural Language Processing // Active</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-12 h-12 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors text-text-muted"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSearch} className="relative mb-12">
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Describe your neural requirements..."
                    className="w-full bg-black/5 border border-black/5 rounded-3xl py-6 pl-8 pr-20 text-text-main font-body text-lg focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all placeholder:text-text-muted/40"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
                    {isSearching ? (
                      <div className="flex gap-1">
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-accent-primary rounded-full" />
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-accent-primary rounded-full" />
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-accent-primary rounded-full" />
                      </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-black/5 rounded-lg border border-black/5 text-[10px] font-mono text-text-muted">
                            <Command size={10} /> <span>Enter</span>
                        </div>
                    )}
                  </div>
                </form>

                {/* Search Results */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar mb-10">
                   <AnimatePresence>
                     {results.map((product, i) => (
                       <motion.div
                         key={product._id}
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.05 }}
                         onClick={() => handleSelectProduct(product._id)}
                         className="flex items-center gap-6 p-4 rounded-2xl bg-black/5 hover:bg-white border border-transparent hover:border-accent-primary/20 cursor-pointer group transition-all"
                       >
                         <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/5 flex-shrink-0">
                           <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                           <h3 className="font-display text-lg text-text-main italic group-hover:text-accent-primary transition-colors">{product.name}</h3>
                           <p className="font-mono text-[9px] text-text-muted uppercase tracking-widest">{product.brand} // {product.category}</p>
                         </div>
                         <div className="text-right">
                            <span className="font-mono font-bold text-text-main">${product.price}</span>
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                   
                   {!isSearching && results.length === 0 && query && (
                       <div className="py-10 text-center">
                           <p className="text-text-muted font-display text-lg italic">No data packets found.</p>
                       </div>
                   )}
                </div>

                {/* Suggestions Grid (only show when no query or no results) */}
                {results.length === 0 && (
                  <div>
                    <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest block mb-6">Semantic Suggestions</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          "I need low latency for data streaming.",
                          "Show me premium retinal optics.",
                          "Find biometric-sync wearable gear.",
                          "The most durable haptic peripherals."
                        ].map((hint, i) => (
                          <button
                            key={i}
                            onClick={() => {
                                setQuery(hint);
                                performSearch(hint);
                            }}
                            className="text-left font-body text-xs text-text-main p-5 rounded-2xl bg-black/5 border border-transparent hover:border-accent-primary/20 hover:bg-white transition-all group flex items-center justify-between"
                          >
                            {hint}
                            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent-primary" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AISearchOrb;
