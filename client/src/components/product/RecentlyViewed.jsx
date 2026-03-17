import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';

const RecentlyViewed = () => {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (history.length > 0) {
        setItems(history);
    } else {
        // Fallback demo data
        setItems([
            { id: 1, name: 'Neural Link V4', price: 2499, image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=400' },
            { id: 2, name: 'Retinal Iris Pro', price: 1899, image: 'https://images.unsplash.com/photo-1576086213369-9713438b11ad?auto=format&fit=crop&q=80&w=400' },
            { id: 3, name: 'Haptic Glove S1', price: 999, image: 'https://images.unsplash.com/photo-1558444479-2706fa53002d?auto=format&fit=crop&q=80&w=400' }
        ]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('recentlyViewed');
    setItems([]);
  };

  if (items.length === 0) return null;
  return (
    <section className="py-24 px-6 md:px-12 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-accent-primary" />
          <h2 className="font-display text-text-main text-2xl italic">Recent Pulses.</h2>
        </div>
        <button 
          onClick={clearHistory}
          className="font-mono text-[9px] uppercase tracking-widest text-text-muted hover:text-accent-primary transition-colors flex items-center gap-2"
        >
          Clear History <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto pb-8 lg:pb-0 no-scrollbar snap-x snap-mandatory">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-72 lg:w-auto h-40 flex-shrink-0 glass p-4 rounded-3xl border border-black/5 hover:border-accent-primary/40 transition-all group flex items-center gap-6 snap-center"
          >
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-black/5 grayscale group-hover:grayscale-0 transition-all duration-500">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-text-main text-sm lg:text-base italic mb-1 truncate">{item.name}</h3>
              <p className="font-mono text-accent-primary text-[10px] md:text-xs font-bold">${item.price}</p>
              <button className="mt-4 w-full py-2 rounded-lg bg-black/5 text-text-main font-mono text-[8px] uppercase tracking-widest hover:bg-accent-primary hover:text-black transition-all">
                Quick Re-sync
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
