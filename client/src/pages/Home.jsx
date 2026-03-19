import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import HeroCarousel from '../components/home/HeroCarousel';
import CategoryQuickLinks from '../components/home/CategoryQuickLinks';
import DealsSection from '../components/home/DealsSection';
import ProductRow from '../components/home/ProductRow';
import CategoryPanels from '../components/home/CategoryPanels';
import WideBanner from '../components/home/WideBanner';
import SellerSpotlight from '../components/home/SellerSpotlight';

import { useStore } from '../context/StoreContext';
import { useAuthStore, useCartStore } from '../context/stores';
import { defaultSiteConfig, fetchSiteConfig } from '../utils/siteConfig';

const Home = () => {
  const { products } = useStore();
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

  const inspiredByBrowsing = products
    .filter(
      (p) =>
        recentlyViewed.some((rv) => rv.category === p.category) &&
        !recentlyViewed.some((rv) => (rv._id || rv.id) === (p._id || p.id))
    )
    .slice(0, 10);

  return (
    <div className="min-h-screen pb-14">
      <section className="site-shell pt-4 md:pt-6">
        <HeroCarousel />
      </section>

      {siteConfig.globalAnnouncementEnabled && siteConfig.globalAnnouncementText && (
        <section className="site-shell mt-4">
          <div className="rounded-2xl bg-gradient-to-r from-brand-primary to-[#0f2f94] px-4 py-2.5 text-center text-xs md:text-sm font-semibold text-white">
            {siteConfig.globalAnnouncementText}
          </div>
        </section>
      )}

      {isAdmin && (
        <section className="site-shell mt-5">
          <div className="panel p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] font-bold text-text-muted">Admin Access</p>
              <p className="text-sm text-text-secondary mt-1">Manage sellers, orders, and platform performance from one place.</p>
            </div>
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center justify-center rounded-pill bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Open Admin Dashboard
            </Link>
          </div>
        </section>
      )}

      <section className="site-shell mt-6">
        <div className="panel p-3 md:p-4">
          <CategoryQuickLinks />
        </div>
      </section>

      {siteConfig.showDealsSection && (
        <section className="site-shell mt-7">
          <div className="panel p-4 md:p-6">
            <DealsSection products={products.filter((p) => p.isDeal)} />
          </div>
        </section>
      )}

      {siteConfig.showRecommended && (
        <section className="site-shell mt-8">
          <ProductRow eyebrow="PERSONALISED" title="Recommended For You" products={products.slice(0, 10)} />
        </section>
      )}

      {siteConfig.showCategoryPanels && (
        <section className="site-shell mt-9">
          <div className="panel p-4 md:p-6">
            <CategoryPanels />
          </div>
        </section>
      )}

      {siteConfig.showWideBanner && (
        <section className="site-shell mt-9">
          <WideBanner />
        </section>
      )}

      {siteConfig.showBestsellers && (
        <section className="site-shell mt-10">
          <ProductRow eyebrow="POPULAR" title="Bestsellers" products={bestsellerProducts} />
        </section>
      )}

      {siteConfig.showNewArrivals && (
        <section className="site-shell mt-10">
          <ProductRow eyebrow="JUST IN" title="New Arrivals" products={newArrivalProducts} />
        </section>
      )}

      {siteConfig.showSellerSpotlight && (
        <section className="site-shell mt-10">
          <div className="panel p-4 md:p-6">
            <SellerSpotlight />
          </div>
        </section>
      )}

      {siteConfig.showRecentlyViewed && recentlyViewed.length > 0 && (
        <>
          <section className="site-shell mt-10">
            <ProductRow eyebrow="YOUR HISTORY" title="Recently Viewed" products={recentlyViewed} />
          </section>

          <section className="site-shell mt-10">
            <div className="panel p-4 md:p-6">
              <ProductRow eyebrow="AI PERSONALISED" title="Inspired by your browsing" products={inspiredByBrowsing} />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
