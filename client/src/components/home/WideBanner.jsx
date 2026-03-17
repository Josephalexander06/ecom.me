import React from 'react';
import { ArrowRight } from 'lucide-react';

const WideBanner = () => {
  return (
    <div className="relative w-full h-[140px] md:h-[180px] rounded-pro overflow-hidden group">
      <img 
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=80" 
        alt="Promotion" 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-text-primary/90 via-text-primary/40 to-transparent" />
      
      <div className="absolute inset-0 flex items-center px-8 md:px-12">
        <div className="max-w-lg">
          <h2 className="text-white text-h4 md:text-h2 font-display font-bold mb-2">
            The ecom.me <span className="text-brand-primary">Elite</span> Collection
          </h2>
          <p className="text-white/80 text-caption md:text-small mb-4 hidden sm:block">
            Curated selection of premium electronics and lifestyle products with next-day delivery.
          </p>
          <button className="bg-brand-primary text-white px-6 py-2 rounded-pill font-bold text-small flex items-center gap-2 hover:bg-brand-hover transition-colors">
            Explore Collection <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WideBanner;
