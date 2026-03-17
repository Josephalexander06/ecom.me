import React from 'react';
import { motion } from 'framer-motion';

const BrandStory = () => {
  return (
    <section className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden bg-bg-deep py-24 px-6 md:px-12">
      {/* Background Visual Influence - Only for lg+ */}
      <div className="absolute inset-0 opacity-10 hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-secondary/10 to-transparent" />
        <img 
          src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000" 
          alt="Neural Pattern"
          className="w-full h-full object-cover grayscale opacity-30"
        />
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <span className="font-mono text-accent-primary text-[10px] md:text-xs tracking-[0.6em] uppercase mb-8 block">
            AETHER Vision // 2040
          </span>
          <h2 className="font-display text-text-main leading-[1.1] mb-12 italic">
            "Your digital self is <br className="hidden md:block" /> 
            as real as your biological one."
          </h2>
          <div className="w-16 md:w-24 h-[1px] bg-accent-primary mx-auto mb-10 md:mb-12 shadow-[0_0_10px_var(--accent-primary)]" />
          <p className="font-body text-text-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            Since 2032, AETHER has been the primary architect of neural-human convergence. 
            We don't just sell hardware; we bridge the synaptic divide. 
            Step into the next cycle of evolution.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
