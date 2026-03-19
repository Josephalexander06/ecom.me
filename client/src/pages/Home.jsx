import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { useAuthStore, useCartStore } from '../context/stores';
import { defaultSiteConfig, fetchSiteConfig } from '../utils/siteConfig';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { products, loadingProducts } = useStore();
  const { user } = useAuthStore();
  const { recentlyViewed } = useCartStore();
  const isAdmin = user?.role === 'admin' || user?.isAdmin;
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);

  const bestsellerProducts = useMemo(
    () => [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 10),
    [products]
  );

  const newArrivalProducts = useMemo(
    () => [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10),
    [products]
  );

  // Animation setup removed in favor of instant rendering (2024 standard)
  useEffect(() => {
    // We intentionally leave this empty or remove it entirely
    // Modern e-commerce prioritizes instant Time-To-Interactive over heavy scroll reveals
  }, [loadingProducts]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchSiteConfig();
        setSiteConfig(config);
      } catch {
        setSiteConfig(defaultSiteConfig);
      }
    };
    loadConfig();
  }, []);

  return (
    <div className="bg-white min-h-screen flex flex-col space-y-0 pb-12">
      {/* 1. Hero Carousel (380px) */}
      <section className="animate-section">
        <HeroCarousel />
      </section>

      {siteConfig.globalAnnouncementEnabled && siteConfig.globalAnnouncementText && (
        <section className="bg-brand-primary text-white py-2.5 animate-section">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-small font-bold text-center tracking-wide">
            {siteConfig.globalAnnouncementText}
          </div>
        </section>
      )}

      {isAdmin && (
        <section className="px-4 md:px-8 pt-6 animate-section">
          <div className="max-w-[1400px] mx-auto">
            <div className="bg-surface-secondary border border-border-default rounded-pro p-4 md:p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-caption font-bold text-text-muted uppercase tracking-wider">Admin Access</p>
                <p className="text-small text-text-primary">Manage users, sellers, orders, and platform metrics.</p>
              </div>
              <Link to="/admin/dashboard" className="bg-brand-primary text-white px-5 py-2.5 rounded-pill font-bold hover:bg-brand-hover transition-colors whitespace-nowrap">
                Open Admin Dashboard
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 2. Category Quick Links (120px) */}
      <section className="bg-white border-y border-border-default h-[120px] flex items-center animate-section">
        <CategoryQuickLinks />
      </section>

      {siteConfig.showDealsSection && (
        <section className="bg-surface-secondary py-12 animate-section">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <DealsSection products={products.filter(p => p.isDeal)} />
          </div>
        </section>
      )}

      {siteConfig.showRecommended && (
        <section className="py-12 animate-section">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <ProductRow 
              eyebrow="PERSONALISED" 
              title="Recommended For You" 
              products={products.slice(0, 10)} 
            />
          </div>
        </section>
      )}

      {siteConfig.showCategoryPanels && (
        <section className="py-12 bg-surface-secondary/50 animate-section">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <CategoryPanels />
          </div>
        </section>
      )}

      {siteConfig.showWideBanner && (
        <section className="px-4 md:px-8 pb-12 animate-section">
          <div className="max-w-[1400px] mx-auto">
            <WideBanner />
          </div>
        </section>
      )}

      {siteConfig.showBestsellers && (
        <section className="pb-12 animate-section">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <ProductRow 
              eyebrow="POPULAR" 
              title="Bestsellers" 
              products={bestsellerProducts} 
            />
          </div>
        </section>
      )}

      {siteConfig.showNewArrivals && (
        <section className="pb-12 animate-section">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <ProductRow 
              eyebrow="JUST IN" 
              title="New Arrivals" 
              products={newArrivalProducts} 
            />
          </div>
        </section>
      )}

      {siteConfig.showSellerSpotlight && (
        <section className="py-12 bg-brand-light/30 animate-section">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <SellerSpotlight />
          </div>
        </section>
      )}

       {siteConfig.showRecentlyViewed && recentlyViewed.length > 0 && (
        <>
          <section className="py-12 animate-section">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
              <ProductRow 
                eyebrow="YOUR HISTORY" 
                title="Recently Viewed" 
                products={recentlyViewed} 
              />
            </div>
          </section>

          {/* Inspired by your browsing */}
          <section className="py-12 bg-surface-secondary/30 animate-section border-y border-border-default">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
              <ProductRow 
                eyebrow="AI PERSONALISED" 
                title="Inspired by your browsing" 
                products={products.filter(p => 
                  recentlyViewed.some(rv => rv.category === p.category) && 
                  !recentlyViewed.some(rv => (rv._id || rv.id) === (p._id || p.id))
                ).slice(0, 10)} 
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
