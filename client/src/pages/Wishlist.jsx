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
        headers: authHeaders(),
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
    <div className="min-h-screen pb-10">
      <section className="site-shell pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">My Wishlist</h1>
          <Link to="/products" className="text-sm font-semibold text-brand-primary hover:underline">
            Continue Shopping
          </Link>
        </div>
      </section>

      <section className="site-shell mt-5">
        {!loading && items.length === 0 ? (
          <div className="panel p-8 md:p-10">
            <EmptyState type="search" title="Your wishlist is empty" message="Save products you love to revisit them quickly." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {items.map((product) => {
              const id = product._id || product.id;
              return (
                <div key={id} className="relative">
                  <ProductCard product={product} />
                  <button
                    onClick={() => remove(id)}
                    className="absolute top-3 right-3 rounded-pill border border-border-default bg-white px-3 py-1 text-xs font-semibold text-danger hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Wishlist;
