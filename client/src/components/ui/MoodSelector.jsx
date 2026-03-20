import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeImage from './SafeImage';
// No icons used currently

const collections = [
  { 
    id: 'Neural Alpha', 
    intent: 'PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800',
    span: 'lg:col-span-3'
  },
  { 
    id: 'Iris Protocol', 
    intent: 'VISUALS',
    image: 'https://images.unsplash.com/photo-1576086213369-9713438b11ad?auto=format&fit=crop&q=80&w=800',
    span: 'lg:col-span-2'
  },
  { 
    id: 'Somatic Gear', 
    intent: 'HAPTICS',
    image: 'https://images.unsplash.com/photo-1558444479-2706fa53002d?auto=format&fit=crop&q=80&w=800',
    span: 'lg:col-span-2'
  },
  { 
    id: 'Void Series', 
    intent: 'STEALTH',
    image: 'https://images.unsplash.com/photo-1614850523296-e8c041de8c2e?auto=format&fit=crop&q=80&w=800',
    span: 'lg:col-span-3'
  },
];

const Collections = () => {
  return (
    <section className="py-32 px-6 md:px-12 bg-[#050505]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div className="max-w-2xl">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="font-mono text-accent-primary text-[10px] tracking-[0.5em] uppercase mb-4 block font-bold"
          >
            Curated Arcs // 2040
          </motion.span>
          <h2 className="font-display text-white italic leading-[1.1]">
            Store by <br />
            <span className="text-white/40">Technical Intent.</span>
          </h2>
        </div>
        <p className="text-white/40 font-body text-lg max-w-sm mb-2">
          Adaptive neural hardware categorized by biometric demand and cognitive payload.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[1200px] lg:h-[700px]">
        {collections.map((col, i) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.8 }}
            className={`relative group overflow-hidden rounded-[3rem] glass border-white/5 cursor-pointer ${col.span}`}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700 z-10" />
            <SafeImage 
              src={col.image} 
              alt={col.id} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out grayscale group-hover:grayscale-0"
            />
            
            <div className="absolute inset-0 p-10 flex flex-col justify-end z-20">
               <motion.span 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="font-mono text-[9px] text-accent-primary tracking-[0.3em] font-bold mb-2"
               >
                 {col.intent}
               </motion.span>
               <h3 className="font-display text-white text-3xl italic leading-tight group-hover:text-accent-primary transition-colors">
                 {col.id}
               </h3>
               
               <div className="h-[2px] w-0 group-hover:w-full bg-accent-primary/30 mt-6 transition-all duration-700" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Collections;
