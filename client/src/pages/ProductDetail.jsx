import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Star, 
  Info, 
  ChevronRight,
  Heart,
  Share2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuthStore, useCartStore } from '../context/stores';
import { API_BASE, authHeaders } from '../utils/api';
import ImageZoom from '../components/product/ImageZoom';
import ProductRow from '../components/home/ProductRow';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, refreshProducts } = useStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const product = useMemo(
    () => products.find((item) => (item._id || item.id) === id),
    [products, id]
  );

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!product) return null;

  const currentPrice = product.dealPrice || product.price;
  const isDeal = product.isDeal && product.dealPrice;
  const savings = product.price - currentPrice;

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/auth/wishlist/${id}`, {
        method: 'POST',
        headers: authHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update wishlist');
      toast.success(data.message || 'Wishlist updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }
    setSubmittingReview(true);
    try {
      const response = await fetch(`${API_BASE}/products/${id}/reviews`, {
        method: 'POST',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ rating, comment })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit review');
      toast.success('Review submitted');
      setComment('');
      await refreshProducts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-caption font-medium text-text-muted">
        <Link to="/products" className="hover:text-brand-primary">Products</Link>
        <ChevronRight size={12} />
        <Link to={`/products?category=${product.category}`} className="hover:text-brand-primary">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-text-secondary truncate">{product.name}</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_35%_20%] gap-8">
          
          {/* Column 1: Gallery */}
          <section className="space-y-4">
            <ImageZoom src={product.images?.[0]} alt={product.name} />
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((img, i) => (
                <div key={i} className="aspect-square bg-surface-secondary rounded-lg border border-border-default overflow-hidden cursor-pointer hover:border-brand-primary transition-colors">
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>

          {/* Column 2: Info */}
          <section className="space-y-6">
            <div>
              <Link to={`/products?brand=${product.brand}`} className="text-small font-bold text-brand-primary hover:underline">
                Visit the {product.brand} Store
              </Link>
              <h1 className="text-h2 font-display text-text-primary mt-1 leading-tight">
                {product.name}
              </h1>
              
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5 border-r border-border-default pr-4">
                  <div className="flex items-center text-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(product.averageRating || 4.5) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-small font-bold text-brand-primary">{(product.averageRating || 4.5).toFixed(1)}</span>
                </div>
                <span className="text-small text-text-muted font-medium">{product.reviewCount || '1.2k'} customer reviews</span>
              </div>
            </div>

            <div className="p-5 bg-surface-secondary rounded-pro border border-border-default">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-h1 font-mono font-bold text-text-primary">₹{currentPrice.toLocaleString('en-IN')}</span>
                {isDeal && (
                  <span className="text-small text-danger bg-danger/5 px-2 py-0.5 rounded border border-danger/10 font-bold">
                    -{Math.round((savings / product.price) * 100)}%
                  </span>
                )}
              </div>
              {isDeal && (
                <div className="text-small text-text-muted">
                  M.R.P.: <span className="line-through">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              )}
              {isDeal && (
                <div className="text-small font-bold text-text-primary mt-2 flex items-center gap-1.5">
                  <span className="text-success">You Save:</span>
                  <span className="text-success">₹{savings.toLocaleString('en-IN')} ({Math.round((savings / product.price) * 100)}%)</span>
                </div>
              )}
              <div className="mt-2 text-caption text-text-tertiary">Inclusive of all taxes</div>
            </div>

            <div className="space-y-4 py-6 border-y border-border-default">
              <h3 className="text-small font-bold text-text-primary uppercase tracking-wider">Product Features</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-small text-text-secondary leading-relaxed">
                  <CheckCircle className="text-brand-primary flex-shrink-0 mt-1" size={16} />
                  <span>Premium {product.brand} craftsmanship with high-grade materials.</span>
                </li>
                <li className="flex gap-3 text-small text-text-secondary leading-relaxed">
                  <CheckCircle className="text-brand-primary flex-shrink-0 mt-1" size={16} />
                  <span>Official ecom.me Certified product with 1-year warranty.</span>
                </li>
                <li className="flex gap-3 text-small text-text-secondary leading-relaxed text-wrap">
                  <CheckCircle className="text-brand-primary flex-shrink-0 mt-1" size={16} />
                  <span>{product.description}</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Column 3: Buy Box */}
          <aside className="space-y-4 lg:pb-20">
            <div className="p-6 border border-border-default rounded-pro bg-white shadow-sm lg:sticky lg:top-[120px]">
              <div className="text-h2 font-mono font-bold text-text-primary mb-4">
                ₹{(currentPrice * quantity).toLocaleString('en-IN')}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-brand-primary" />
                  <div className="text-caption">
                    <p className="font-bold text-text-primary">Deliver to India</p>
                    <p className="text-text-muted">Ships from ecom.me Mumbai</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Truck size={18} className="text-brand-primary" />
                  <div className="text-caption">
                    <p className="font-bold text-success">FREE Delivery by Tomorrow</p>
                    <p className="text-text-muted">Order within 4 hrs 24 mins</p>
                  </div>
                </div>

                <div className="pt-2">
                  {product.stock > 0 ? (
                    <p className="text-small font-bold text-success flex items-center gap-1.5 uppercase tracking-tighter">
                      In Stock
                    </p>
                  ) : (
                    <p className="text-small font-bold text-danger uppercase tracking-tighter">Temporarily Out of Stock</p>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <p className="text-caption text-danger font-medium mt-1">
                      Only {product.stock} units left - order soon.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-surface-secondary px-4 py-3 rounded-lg border border-border-default">
                  <span className="text-caption font-bold text-text-secondary">Quantity:</span>
                  <select 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="flex-1 bg-transparent text-small font-bold text-text-primary focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => addItem(product, quantity)}
                  className="w-full bg-brand-primary hover:bg-brand-hover text-white py-4 rounded-pro font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 group"
                >
                   Add to Bag
                   <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                     <ChevronRight size={18} />
                   </motion.div>
                </button>
                <Link 
                  to="/checkout"
                  onClick={() => addItem(product, quantity)}
                  className="block w-full text-center bg-warning hover:bg-[#e66000] text-white py-4 rounded-pro font-bold transition-all shadow-lg shadow-warning/20"
                >
                  Buy Now
                </Link>
              </div>

              <div className="mt-6 space-y-3 pt-6 border-t border-border-default">
                <button onClick={toggleWishlist} className="flex items-center gap-2.5 text-small font-medium text-text-secondary hover:text-brand-primary transition-colors group">
                  <Heart size={18} className="group-hover:fill-brand-primary group-hover:stroke-brand-primary transition-colors" /> Save for later
                </button>
                <div className="flex items-center gap-2.5 text-small font-medium text-text-secondary">
                  <ShieldCheck size={18} className="text-success" /> 100% Secure Payment
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Info Tabs / Sections */}
        <div className="mt-20 border-t border-border-default pt-20">
          <div className="mb-12 bg-surface-secondary border border-border-default rounded-pro p-6">
            <h3 className="text-body font-bold text-text-primary mb-4">Write a review</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="text-caption font-bold text-text-secondary">Rating</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full mt-1 bg-white border border-border-default rounded-lg px-4 py-2.5">
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="text-caption font-bold text-text-secondary">Comment</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="w-full mt-1 bg-white border border-border-default rounded-lg px-4 py-2.5" placeholder="Share your experience..." />
              </div>
              <button type="submit" disabled={submittingReview} className="bg-brand-primary text-white px-6 py-2.5 rounded-lg font-bold disabled:opacity-70">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
          <ProductRow 
            eyebrow="YOU MAY ALSO LIKE" 
            title="Customers also shopped for"
            products={products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 10)} 
          />
        </div>
      </div>
    </div>
  );
};

const CheckCircle = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default ProductDetail;
