import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../context/stores';
import { API_BASE, authHeaders } from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import EmptyState from '../components/ui/EmptyState';

const Wishlist = () => {
  const { isAuthenticated } = useAuthStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/wishlist`, { headers: authHeaders() });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load wishlist');
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const remove = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/auth/wishlist/${id}`, {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update wishlist');
      setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-surface-secondary min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-h2 font-display text-text-primary">My Wishlist</h1>
          <Link to="/products" className="text-small font-bold text-brand-primary hover:underline">Continue Shopping</Link>
        </div>

        {!loading && items.length === 0 ? (
          <EmptyState type="search" title="Your wishlist is empty" message="Save products you love to find them quickly later." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => {
              const id = product._id || product.id;
              return (
                <div key={id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => remove(id)}
                    className="absolute top-3 right-3 bg-white border border-border-default rounded-full px-3 py-1 text-caption font-bold text-danger hover:bg-danger/5"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

