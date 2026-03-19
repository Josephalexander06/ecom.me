import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import { useCartStore, useAuthStore, useUIStore } from '../context/stores';
import { useStore } from '../context/StoreContext';
import { fetchSiteConfig, defaultSiteConfig } from '../utils/siteConfig';
import ProductRow from '../components/home/ProductRow';
import EmptyState from '../components/ui/EmptyState';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  
  return (
    <div className="flex gap-4 md:gap-6 py-6 border-b border-border-default last:border-0">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-surface-secondary rounded-img overflow-hidden flex-shrink-0 border border-border-default">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-small md:text-body font-bold text-text-primary line-clamp-2 hover:text-brand-primary transition-colors cursor-pointer">
              {item.name}
            </h3>
            <p className="text-caption text-text-muted mt-1">In Stock</p>
          </div>
          <div className="text-right">
            <span className="text-body font-mono font-bold text-text-primary">
              ₹{item.price.toLocaleString('en-IN')}
            </span>
            <p className="text-caption text-text-muted mt-1 uppercase tracking-tighter">
              ₹{item.price.toLocaleString('en-IN')} ea.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 bg-surface-secondary rounded-lg border border-border-default p-1">
            <button 
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-surface-tertiary rounded-md transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center text-small font-bold">{item.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-surface-tertiary rounded-md transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <button 
            onClick={() => removeItem(item.productId)}
            className="flex items-center gap-1.5 text-caption font-bold text-danger hover:underline"
          >
            <Trash2 size={14} /> Remove
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

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  }, [items]);

  const threshold = siteConfig.freeShippingThreshold || 5000;
  const shippingCharge = siteConfig.defaultShippingCharge || 499;
  
  const shipping = subtotal >= threshold ? 0 : shippingCharge;
  const tax = subtotal * 0.18; // 18% GST for India
  const total = subtotal + shipping + tax;
  const progressToFree = Math.min((subtotal / threshold) * 100, 100);

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <EmptyState 
          type="cart" 
          actionLabel="Start Shopping" 
          actionLink="/products" 
        />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 lg:py-12">
        <h1 className="text-h2 font-display text-text-primary mb-8 underline decoration-brand-primary decoration-4 underline-offset-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Main Column */}
          <section className="space-y-8">
            {/* Free Shipping Progress */}
            <div className="bg-surface-secondary border border-border-default rounded-pro p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck size={20} className={subtotal >= threshold ? 'text-success' : 'text-brand-primary'} />
                  <span className="text-small font-bold text-text-primary">
                    {subtotal >= threshold 
                      ? "You've earned FREE Express Delivery!" 
                      : `Add ₹${(threshold - subtotal).toLocaleString('en-IN')} for FREE Express Delivery`}
                  </span>
                </div>
                <span className="text-caption font-bold text-text-muted">{Math.round(progressToFree)}%</span>
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-border-default">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${progressToFree}%` }}
                   transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                   className={`h-full ${subtotal >= threshold ? 'bg-success' : 'bg-brand-primary'}`} 
                />
              </div>
            </div>

            {/* Item List */}
            <div className="bg-white border border-border-default rounded-pro p-4 md:p-8">
              <div className="flex items-center justify-between border-b border-border-default pb-6 mb-2">
                <h2 className="text-body font-bold text-text-primary">Your Items ({items.length})</h2>
              </div>
              <AnimatePresence>
                {items.map(item => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Sidebar: Order Summary */}
          <aside className="relative">
            <div className="bg-white border border-border-default rounded-pro p-8 sticky top-[120px] shadow-sm">
              <h2 className="text-body font-bold text-text-primary mb-6">Price Details</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Price ({items.length} items)</span>
                  <span className="font-mono text-text-primary font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Delivery Charges</span>
                  {shipping === 0 ? (
                    <span className="text-success font-bold">FREE</span>
                  ) : (
                    <span className="font-mono text-text-primary font-bold">₹{shipping}</span>
                  )}
                </div>
                <div className="flex justify-between text-small text-text-secondary">
                  <span>GST (18%)</span>
                  <span className="font-mono text-text-primary font-bold">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-[1px] bg-border-default my-4" />
                <div className="flex justify-between text-body font-bold text-text-primary">
                  <span>Total Amount</span>
                  <span className="text-h3 font-mono font-bold text-brand-primary">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/checkout');
                  } else {
                    setActiveModal('login');
                  }
                }}
                className="w-full bg-brand-primary hover:bg-brand-hover text-white py-4 rounded-pro font-bold transition-all flex items-center justify-center gap-2 group mb-4 shadow-lg shadow-brand-primary/20"
              >
                Place Order
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex gap-3 text-caption text-text-muted leading-tight mt-6 pt-6 border-t border-border-default">
                <ShieldCheck size={18} className="text-success flex-shrink-0" />
                <span>Your transaction is protected by SSL encryption and ecom.me's buyer protection.</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Recommendations */}
        <div className="mt-20 border-t border-border-default pt-20">
          <ProductRow 
            eyebrow="MORE DISCOVERIES" 
            title="Customers also bought" 
            products={products.slice(0, 10)} 
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
