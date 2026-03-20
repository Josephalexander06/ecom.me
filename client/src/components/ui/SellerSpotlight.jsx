import React from 'react';
import { motion } from 'framer-motion';
import { Star, Verified, Store } from 'lucide-react';
import SafeImage from './SafeImage';

const sellers = [
  {
    name: "NeuralCore Labs",
    logo: "/brain/2acfed63-dc62-4695-aaa8-5a9798ce5256/seller_neuralcore_logo_1773542564848.png",
    rating: 4.9,
    sales: "125k+",
    tagline: "Premier brain-interface research and retail."
  },
  {
    name: "BioSync Systems",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=300",
    rating: 4.7,
    sales: "84k+",
    tagline: "Connecting biology with the neural matrix."
  },
  {
    name: "HapticFlow",
    logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&q=80&w=300",
    rating: 4.8,
    sales: "56k+",
    tagline: "Feel the digital. High-fidelity somatic gear."
  }
];

const SellerSpotlight = () => {
  return (
    <section className="py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div>
          <h2 className="text-text-main text-2xl font-bold tracking-tight">Seller Spotlight</h2>
          <p className="text-text-muted text-sm mt-1">Discover top artisans and hardware labs on Aether.</p>
        </div>
        <button className="bg-accent-primary text-white px-8 py-3 rounded-sm text-xs font-bold uppercase transition-all flex items-center gap-2 shadow-sm">
          View All Stores <Store size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sellers.map((seller, idx) => (
          <motion.div
            key={seller.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-sm shadow-sm relative group overflow-hidden hover:shadow-md transition-shadow"
          >
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-16 h-16 rounded-md bg-white overflow-hidden border border-border-main group-hover:border-accent-primary transition-all">
                      <SafeImage src={seller.logo} alt={seller.name} className="w-full h-full object-contain" />
                   </div>
                   <div>
                      <h3 className="text-text-main font-bold text-lg flex items-center gap-2">
                        {seller.name}
                        <Verified size={16} className="text-accent-primary" />
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5 text-accent-success">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{seller.rating}</span>
                      </div>
                   </div>
                </div>

                <p className="text-text-muted text-[13px] leading-relaxed mb-8">
                  {seller.tagline}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-main">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Total Sales</span>
                      <span className="text-sm font-bold text-text-main uppercase">{seller.sales}</span>
                   </div>
                   <button className="text-accent-primary hover:bg-accent-primary/5 h-9 px-5 rounded-sm text-xs font-bold uppercase transition-all border border-accent-primary">
                      Visit Store
                   </button>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SellerSpotlight;
