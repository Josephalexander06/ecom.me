import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Eye, Link2, Brain, Activity, 
  Cpu, Battery, Database 
} from 'lucide-react';

const categories = [
  { name: 'Neural Links', icon: Brain, slug: 'neural' },
  { name: 'Retinal', icon: Eye, slug: 'retinal' },
  { name: 'Haptic', icon: Zap, slug: 'haptic' },
  { name: 'Cognitive', icon: Activity, slug: 'cognitive' },
  { name: 'Bionics', icon: Link2, slug: 'bionics' },
  { name: 'Synapse Kits', icon: Cpu, slug: 'synapse' },
  { name: 'Power Cells', icon: Battery, slug: 'power' },
  { name: 'Bio-Drives', icon: Database, slug: 'bio' },
];

const CategoryRow = () => {
  return (
    <section className="bg-white py-4 md:py-6 shadow-sm mb-4 rounded-sm border-b border-border-main">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-10 gap-8 md:gap-12">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all bg-white group-hover:scale-110">
              <cat.icon size={48} strokeWidth={1} className="text-accent-primary" />
            </div>
            <span className="text-[10px] md:text-sm font-bold text-text-main group-hover:text-accent-primary transition-colors">
              {cat.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryRow;
