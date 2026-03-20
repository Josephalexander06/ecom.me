import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE, authHeaders } from '../../utils/api';
import { useAuthStore, useCartStore } from '../../context/stores';
import ProductCard from '../ui/ProductCard';

const RecentlyViewed = ({ limit = 6, title = "Picked for you" }) => {
  const { isAuthenticated } = useAuthStore();
  const { recentlyViewed: localHistory } = useCartStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    } else {
      setItems(Array.isArray(localHistory) ? localHistory : []);
    }
  }, [isAuthenticated, localHistory]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/recently-viewed`, {
        headers: authHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch recently viewed', err);
    } finally {
      setLoading(false);
    }
  };

  const displayItems = items.slice(0, limit);

  if (displayItems.length === 0 && !loading) return null;

  return (
    <section className="py-12 border-t border-border-default/50 bg-surface-secondary/20">
      <div className="site-shell">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight">{title}</h2>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider mt-0.5 flex items-center gap-1.5">
                <Sparkles size={12} className="text-brand-primary" />
                Based on your recent activity
              </p>
            </div>
          </div>
          {displayItems.length > 0 && (
            <Link to="/products" className="group text-sm font-semibold text-brand-primary inline-flex items-center gap-1 hover:underline">
              See more
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-white border border-border-default animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {displayItems.map((product, idx) => (
              <motion.div
                key={`${product._id || product.id}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentlyViewed;
