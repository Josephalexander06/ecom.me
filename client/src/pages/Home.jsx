import React from 'react';
import Hero from '../components/ui/Hero';
import CategoryRow from '../components/ui/CategoryRow';
import DealSection from '../components/ui/DealSection';
import ProductRow from '../components/ui/ProductRow';
import DiscoveryGrids from '../components/ui/DiscoveryGrids';
import SellerSpotlight from '../components/ui/SellerSpotlight';
import Footer from '../components/ui/Footer';
import { recommendedProducts, bestsellers, newArrivals } from '../utils/mockData';

const Home = () => {
  return (
    <div className="bg-bg-secondary min-h-screen w-full">
      <Hero />
      
      <div className="max-w-[1500px] mx-auto w-full px-4 md:px-10">
        <CategoryRow />
        
        <DealSection />

        <ProductRow 
          title="Recommended For You" 
          subtitle="Based on your browsing history"
          products={recommendedProducts}
        />

        <DiscoveryGrids />

        <ProductRow 
          title="Bestsellers on AETHER" 
          subtitle="Top selling augments this month"
          products={bestsellers}
        />

        {/* Promo Banner Ad Strip */}
        <div className="px-4 py-8">
           <div className="w-full h-40 md:h-60 rounded-xl overflow-hidden relative group cursor-pointer shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1500" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
                alt="Banner Ad"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-12 bg-gradient-to-r from-black/80 to-transparent">
                 <span className="text-accent-primary font-bold text-xs uppercase tracking-[0.4em] mb-2">Neural Matrix Payouts</span>
                 <h2 className="text-white text-2xl md:text-5xl font-black tracking-tighter italic">EARN AS YOU SYNC.</h2>
                 <p className="text-white/60 text-sm mt-4 font-body">Become an Aether Affiliate and get 15% on every neural link referred.</p>
              </div>
           </div>
        </div>

        <ProductRow 
          title="New Arrivals" 
          subtitle="Fresh from the research labs"
          products={newArrivals}
        />

        <SellerSpotlight />
        
        <ProductRow 
          title="Your Recently Viewed Items"
          products={recommendedProducts.slice(0, 4)} 
        />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
