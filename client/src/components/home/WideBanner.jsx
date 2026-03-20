import React from 'react';
import { ArrowRight } from 'lucide-react';
import SafeImage from '../ui/SafeImage';

const WideBanner = () => {
  return (
    <div className="relative w-full h-[250px] md:h-[350px] rounded-pro overflow-hidden group border border-border-default/50 shadow-sm">
      <SafeImage 
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=80" 
        alt="Promotion" 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply transition-opacity group-hover:opacity-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute inset-0 flex items-center px-6 md:px-12">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest mb-4">
            Exclusive Drop
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-display font-bold mb-4 leading-tight drop-shadow-md">
            The ecom.me <span className="text-brand-primary">Elite</span> Collection
          </h2>
          <p className="text-white/80 text-small md:text-body mb-8 max-w-sm md:max-w-md leading-relaxed hidden sm:block">
            Curated selection of premium electronics and lifestyle products with next-day hyper-delivery.
          </p>
          <button className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-small flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-m">
            Explore Collection 
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WideBanner;
