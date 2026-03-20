import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore, useAuthStore, useUIStore } from '../context/stores';
import { useStore } from '../context/StoreContext';
import { fetchSiteConfig, defaultSiteConfig } from '../utils/siteConfig';
import ProductRow from '../components/home/ProductRow';
import EmptyState from '../components/ui/EmptyState';
import SafeImage from '../components/ui/SafeImage';
import toast from 'react-hot-toast';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  const handleRemove = () => {
    removeItem(item.productId);
    toast.error(`${item.name} removed from bag`);
  };

  const handleUpdate = (newQty) => {
    if (newQty < 1) return;
    updateQuantity(item.productId, newQty);
    toast.success('Quantity updated', { id: 'qty-update' });
  };

  return (
    <div className="flex gap-4 md:gap-5 py-5 border-b border-border-default last:border-0">
      <Link to={`/product/${item.productId}`} className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-surface-secondary border border-border-default overflow-hidden shrink-0">
        <SafeImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </Link>

      <div className="flex-1">
        <div className="flex justify-between gap-3">
          <div>
            <Link to={`/product/${item.productId}`} className="text-sm md:text-base font-semibold text-text-primary line-clamp-2 hover:text-brand-primary">
              {item.name}
            </Link>
            <p className="text-xs text-text-muted mt-1">In stock</p>
          </div>
          <div className="text-right">
            <p className="text-base font-bold text-text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
            <p className="text-xs text-text-muted">₹{item.price.toLocaleString('en-IN')} each</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="inline-flex items-center rounded-lg border border-border-default bg-surface-secondary p-1">
            <button onClick={() => handleUpdate(item.quantity - 1)} className="h-7 w-7 grid place-items-center rounded hover:bg-surface-tertiary">
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
            <button onClick={() => handleUpdate(item.quantity + 1)} className="h-7 w-7 grid place-items-center rounded hover:bg-surface-tertiary">
              <Plus size={14} />
            </button>
          </div>

          <button onClick={handleRemove} className="inline-flex items-center gap-1 text-xs font-semibold text-danger hover:underline">
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { products } = useStore();
  const { isAuthenticated } = useAuthStore();
  const { setActiveModal } = useUIStore();
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchSiteConfig();
        setSiteConfig(config);
      } catch (err) {
        console.error('Failed to load site config:', err);
      }
    };
    loadConfig();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0),
    [items]
  );

  const threshold = siteConfig.freeShippingThreshold || 5000;
  const shippingCharge = siteConfig.defaultShippingCharge || 499;

  const shipping = subtotal >= threshold ? 0 : shippingCharge;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;
  const progressToFree = Math.min((subtotal / threshold) * 100, 100);

  if (items.length === 0) {
    return (
      <div className="site-shell py-10">
        <div className="panel p-8 md:p-10">
          <EmptyState type="cart" actionLabel="Start Shopping" actionLink="/products" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <section className="site-shell pt-6">
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Shopping Cart</h1>
      </section>

      <section className="site-shell mt-5 grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-6 lg:gap-8">
        <div className="space-y-5">
          <div className="panel p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Truck size={16} className={subtotal >= threshold ? 'text-success' : 'text-brand-primary'} />
                {subtotal >= threshold
                  ? 'You unlocked free express delivery'
                  : `Add ₹${(threshold - subtotal).toLocaleString('en-IN')} for free delivery`}
              </div>
              <span className="text-xs font-bold text-text-muted">{Math.round(progressToFree)}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface-secondary border border-border-default overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToFree}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full ${subtotal >= threshold ? 'bg-success' : 'bg-brand-primary'}`}
              />
            </div>
          </div>

          <div className="panel p-4 md:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-border-default">
              <h2 className="text-base font-semibold">Your Items ({items.length})</h2>
            </div>
            <AnimatePresence>
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <aside>
          <div className="panel p-5 md:p-6 sticky top-[110px]">
            <h2 className="text-base font-semibold mb-5">Price Details</h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Items ({items.length})</span>
                <span className="font-semibold text-text-primary">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Delivery</span>
                {shipping === 0 ? <span className="font-semibold text-success">FREE</span> : <span className="font-semibold text-text-primary">₹{shipping}</span>}
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Tax (GST)</span>
                <span className="font-semibold text-text-primary">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-border-default pt-3.5 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-brand-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (isAuthenticated) navigate('/checkout');
                else setActiveModal('login');
              }}
              className="mt-6 w-full h-11 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors inline-flex items-center justify-center gap-2"
            >
              Place Order
              <ArrowRight size={16} />
            </button>

            <div className="mt-5 pt-5 border-t border-border-default text-xs text-text-muted inline-flex gap-2">
              <ShieldCheck size={15} className="text-success shrink-0 mt-0.5" />
              <span>Secure checkout with encrypted payments and buyer protection.</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="site-shell mt-12">
        <div className="panel p-4 md:p-6">
          <ProductRow eyebrow="MORE DISCOVERIES" title="Customers also bought" products={products.slice(0, 10)} />
        </div>
      </section>
    </div>
  );
};

export default Cart;
