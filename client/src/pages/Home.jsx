import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Layout Components
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryQuickLinks from '../components/home/CategoryQuickLinks';
import DealsSection from '../components/home/DealsSection';
import ProductRow from '../components/home/ProductRow';
import CategoryPanels from '../components/home/CategoryPanels';
import WideBanner from '../components/home/WideBanner';
import SellerSpotlight from '../components/home/SellerSpotlight';

// State & Data
import { useStore } from '../context/StoreContext';
import { useAuthStore } from '../context/stores';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { products, loadingProducts } = useStore();
  const { user } = useAuthStore();

  // Animation setup for section reveals
  useEffect(() => {
    if (loadingProducts) return;
    
    const sections = gsap.utils.toArray('.animate-section');
    sections.forEach((section, i) => {
      gsap.fromTo(
        section,
        { 
          opacity: 0, 
          y: 40,
          scale: 0.98,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end: 'top 70%',
            scrub: 1,
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, [loadingProducts]);

  return (
    <div className="bg-white min-h-screen flex flex-col space-y-0 pb-12">
      {/* 1. Hero Carousel (380px) */}
      <section className="animate-section">
        <HeroCarousel />
      </section>

      {/* 2. Category Quick Links (120px) */}
      <section className="bg-white border-y border-border-default h-[120px] flex items-center animate-section">
        <CategoryQuickLinks />
      </section>

      {/* 3. Deals of the Day (450px) */}
      <section className="bg-surface-secondary py-12 animate-section">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <DealsSection products={products.filter(p => p.isDeal)} />
        </div>
      </section>

      {/* 4. Recommended For You (420px) */}
      <section className="py-12 animate-section">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <ProductRow 
            eyebrow="PERSONALISED" 
            title="Recommended For You" 
            products={products.slice(0, 10)} 
          />
        </div>
      </section>

      {/* 5. Category Exploration Panels (500px) */}
      <section className="py-12 bg-surface-secondary/50 animate-section">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <CategoryPanels />
        </div>
      </section>

      {/* 6. Wide Promotional Banner (180px) */}
      <section className="px-4 md:px-8 pb-12 animate-section">
        <div className="max-w-[1400px] mx-auto">
          <WideBanner />
        </div>
      </section>

      {/* 7. Bestsellers (420px) */}
      <section className="pb-12 animate-section">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <ProductRow 
            eyebrow="POPULAR" 
            title="Bestsellers" 
            products={products.sort((a, b) => b.soldCount - a.soldCount).slice(0, 10)} 
          />
        </div>
      </section>

      {/* 8. New Arrivals (420px) */}
      <section className="pb-12 animate-section">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <ProductRow 
            eyebrow="JUST IN" 
            title="New Arrivals" 
            products={products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)} 
          />
        </div>
      </section>

      {/* 9. Seller Spotlight (320px) */}
      <section className="py-12 bg-brand-light/30 animate-section">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <SellerSpotlight />
        </div>
      </section>

      {/* 10. Recently Viewed — Only if user is logged in or has history */}
      {(user?.recentlyViewed?.length > 0 || true) && (
        <section className="py-12 animate-section">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <ProductRow 
              eyebrow="YOUR HISTORY" 
              title="Recently Viewed" 
              products={products.slice(5, 12)} 
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
