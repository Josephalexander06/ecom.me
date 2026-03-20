import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Shield, Cpu } from 'lucide-react';
import SafeImage from './SafeImage';

const ImpactSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 bg-[#050505]">
      {/* Absolute Background Blueprints */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-accent-primary/20 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-accent-primary/10 rounded-full" />
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left: Product Technical Visual */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative aspect-square glass rounded-[4rem] border-white/5 overflow-hidden group"
        >
          <SafeImage 
            src="https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&q=80&w=1200" 
            alt="Flagship Hardware" 
            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          {/* Diagnostic Overlays */}
          <div className="absolute top-12 left-12 flex flex-col gap-1">
             <span className="font-mono text-[8px] text-accent-primary tracking-widest uppercase">Structural Integrity</span>
             <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '94%' }}
                    transition={{ delay: 1, duration: 1.5 }}
                    className="h-full bg-accent-primary" 
                />
             </div>
          </div>
        </motion.div>

        {/* Right: Persuasion & Tech Specs */}
        <div className="flex flex-col">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-accent-primary text-[10px] tracking-[0.5em] uppercase mb-6 font-bold"
          >
            AETHER FLAGSHIP // MODEL X-1
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-white italic mb-10 leading-[0.9]"
          >
            Limitless <br />
            Integration.
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-xl font-body leading-relaxed mb-12 max-w-lg"
          >
            The X-1 isn't just a wearable; it's a second nervous system. 
            Crafted from singular-crystal silicon and bio-compatible polymers, 
            it delivers the ultimate uplink experience.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="text-white font-display text-sm italic mb-1">Unbreakable Mesh</h4>
                <p className="text-white/40 text-xs leading-relaxed">Encrypted neural paths for 100% sovereign data.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="text-white font-display text-sm italic mb-1">Synapse-X Core</h4>
                <p className="text-white/40 text-xs leading-relaxed">Processing 40 trillion neural impulses per second.</p>
              </div>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-4 text-white font-mono text-[10px] uppercase tracking-[0.3em] group"
          >
            Deep Dive Architecture <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
