import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import useIsDesktop from '../../hooks/useIsDesktop';

const CartDrawer = ({ isOpen, onClose }) => {
  const isDesktop = useIsDesktop();

  const cartItems = [
    {
      id: 1,
      name: 'Neural Link V4',
      price: 2499,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 2,
      name: 'Retinal Iris Pro',
      price: 1899,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1576086213369-9713438b11ad?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const drawerVariants = {
    closed: { x: '100%' },
    open: { x: 0 }
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
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={drawerVariants}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed top-0 right-0 h-full z-[210] bg-white shadow-2xl flex flex-col ${
              isDesktop ? 'w-full max-w-md' : 'w-full'
            }`}
          >
            {/* Header */}
            <div className="p-8 border-b border-black/5 flex items-center justify-between bg-bg-deep">
              <div className="flex items-center gap-4">
                <ShoppingCart size={24} className="text-accent-primary" />
                <h2 className="font-display text-text-main text-2xl italic">Neural Cart</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full hover:bg-black/5 flex items-center justify-center text-text-main transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List - Spatial Perspective Deck */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar perspective-[1000px]">
              {cartItems.map((item, i) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, x: 20, rotateY: 15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ rotateY: -10, scale: 1.02, z: 20 }}
                  className="flex gap-6 p-4 rounded-3xl glass border border-black/5 bg-white/50 group cursor-pointer transition-shadow hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-black/5 relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    {/* Live Inventory Pulse */}
                    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_8px_var(--accent-primary)] animate-pulse" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-display text-text-main text-lg italic group-hover:text-accent-primary transition-colors">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-accent-primary" />
                          <p className="font-mono text-[8px] text-text-muted uppercase tracking-widest">Neural Link Sync: Optimal</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 bg-black/5 rounded-xl p-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"><Minus size={14} /></button>
                        <span className="font-mono text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors"><Plus size={14} /></button>
                      </div>
                      <span className="font-mono text-sm font-bold text-text-main">${item.price}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-black/5 bg-bg-deep">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-1">Estimated Load</span>
                  <span className="text-3xl font-mono text-text-main font-bold">${subtotal}</span>
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-1">Nodes</span>
                   <span className="text-lg font-mono text-text-main">02 Units</span>
                </div>
              </div>
              <button className="w-full py-5 rounded-2xl bg-accent-primary text-black font-display font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] transition-transform shadow-[0_20px_40px_rgba(16,206,209,0.3)] flex items-center justify-center gap-4">
                Initialize Checkout Flow
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
