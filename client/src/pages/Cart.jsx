import React from 'react';
import { Link } from 'react-router-dom';
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
import { useCartStore } from '../context/stores';
import { useStore } from '../context/StoreContext';
import ProductRow from '../components/home/ProductRow';
import EmptyState from '../components/ui/EmptyState';

const CartItem = ({ item }) => {
// ... existing code ...
};

const Cart = () => {
  const { items, subtotal } = useCartStore();
  const { products } = useStore();
  
  const FREE_SHIPPING_THRESHOLD = 5000;
  // ... existing code ...

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
    <div className="bg-surface-primary min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 lg:py-12">
        <h1 className="text-h2 font-display text-text-primary mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Main Column */}
          <section className="space-y-8">
            {/* Free Shipping Progress */}
            <div className="bg-white border border-border-default rounded-pro p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Truck size={20} className={subtotal >= FREE_SHIPPING_THRESHOLD ? 'text-success' : 'text-brand-primary'} />
                  <span className="text-small font-bold text-text-primary">
                    {subtotal >= FREE_SHIPPING_THRESHOLD 
                      ? "You've earned FREE Priority Shipping!" 
                      : `Add $${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} to get FREE Priority Shipping`}
                  </span>
                </div>
                <span className="text-caption font-bold text-text-muted">{Math.round(progressToFree)}%</span>
              </div>
              <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFree}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full ${subtotal >= FREE_SHIPPING_THRESHOLD ? 'bg-success' : 'bg-brand-primary'}`} 
                />
              </div>
            </div>

            {/* Item List */}
            <div className="bg-white border border-border-default rounded-pro p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-border-default pb-6 mb-2">
                <h2 className="text-body font-bold text-text-primary">Items in Cart ({items.length})</h2>
                <button className="text-caption font-bold text-brand-primary hover:underline">Select all items</button>
              </div>
              <AnimatePresence>
                {items.map(item => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Sidebar: Order Summary */}
          <aside>
            <div className="bg-white border border-border-default rounded-pro p-8 sticky top-[150px] shadow-sm">
              <h2 className="text-body font-bold text-text-primary mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-mono text-text-primary font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Shipping & Handling</span>
                  {shipping === 0 ? (
                    <span className="text-success font-bold uppercase tracking-tight">FREE</span>
                  ) : (
                    <span className="font-mono text-text-primary font-bold">${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-text-primary font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="h-[1px] bg-border-default my-2" />
                <div className="flex justify-between text-body font-bold text-text-primary">
                  <span>Order Total</span>
                  <span className="text-h3 font-mono font-bold text-brand-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="w-full bg-brand-primary hover:bg-brand-hover text-white py-4 rounded-pill font-bold transition-all flex items-center justify-center gap-2 group mb-4"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="space-y-4 pt-6 border-t border-border-default">
                <div className="flex gap-3 text-caption text-text-muted leading-tight">
                  <ShieldCheck size={18} className="text-success flex-shrink-0" />
                  <span>Your transaction is protected by 256-bit SSL encryption and ecom.me's buyer protection.</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Saved For Later / Recommendations */}
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
