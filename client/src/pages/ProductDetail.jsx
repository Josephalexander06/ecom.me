import React, { useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  Share2,
  ShoppingCart
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuthStore, useCartStore, useUIStore } from '../context/stores';
import { API_BASE, authHeaders } from '../utils/api';
import ImageZoom from '../components/product/ImageZoom';
import ProductRow from '../components/home/ProductRow';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loadingProducts, refreshProducts } = useStore();
  const { addItem } = useCartStore();
  const { user, isAuthenticated, toggleWishlist } = useAuthStore();
  const { setActiveModal } = useUIStore();

  const product = useMemo(
    () => products.find((item) => (item._id || item.id) === id),
    [products, id]
  );

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isWishloading, setIsWishLoading] = useState(false);

  if (loadingProducts) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-brand-light border-t-brand-primary rounded-full animate-spin mb-4" />
        <p className="text-small font-bold text-text-muted uppercase tracking-widest">Loading Premium Product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
        <h2 className="text-h2 font-display text-text-primary mb-4">Product Not Found</h2>
        <p className="text-body text-text-muted mb-8 max-w-md">We couldn't find the product you're looking for. It might have been removed or the link is incorrect.</p>
        <Link to="/products" className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-primary/20 hover:scale-105 transition-all">
          Browse All Products
        </Link>
      </div>
    );
  }

  const isInWishlist = user?.wishlist?.some(w => (w._id || w) === id);
  const currentPrice = product.dealPrice || product.price;
  const isDeal = product.isDeal && product.dealPrice;
  const savings = product.price - currentPrice;

  const handleWishlist = async () => {
    if (!isAuthenticated) return setActiveModal('login');
    
    setIsWishLoading(true);
    try {
      await toggleWishlist(id);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch (error) {
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return setActiveModal('login');
    
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
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex items-center gap-2 text-caption font-medium text-text-muted overflow-hidden whitespace-nowrap">
        <Link to="/products" className="hover:text-brand-primary">Products</Link>
        <ChevronRight size={12} />
        <Link to={`/products?category=${product.category}`} className="hover:text-brand-primary">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-text-secondary truncate">{product.name}</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[50%_30%_20%] lg:gap-12 gap-8">
          
          {/* Column 1: Gallery */}
          <section className="space-y-6">
            <div className="bg-surface-secondary rounded-pro border border-border-default overflow-hidden group">
              <ImageZoom src={product.images?.[0]} alt={product.name} />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, i) => (
                <div key={i} className="aspect-square bg-surface-secondary rounded-pro border border-border-default overflow-hidden cursor-pointer hover:border-brand-primary hover:shadow-lg transition-all">
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-border-default">
               <h3 className="text-body font-bold text-text-primary mb-4 flex items-center gap-2">
                 <Info size={18} className="text-brand-primary" />
                 Product Description
               </h3>
               <p className="text-small text-text-secondary leading-relaxed whitespace-pre-line">
                 {product.description}
               </p>
            </div>
          </section>

          {/* Column 2: Info */}
          <section className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Link to={`/products?brand=${product.brand}`} className="text-caption font-bold text-brand-primary uppercase tracking-widest hover:underline">
                  {product.brand}
                </Link>
                <div className="flex gap-4">
                   <button onClick={handleWishlist} className={`p-2 rounded-full border transition-all ${isInWishlist ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white border-border-default text-text-muted hover:border-red-500 hover:text-red-500'}`}>
                     <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} className={isWishloading ? 'animate-pulse' : ''} />
                   </button>
                   <button className="p-2 rounded-full border border-border-default text-text-muted hover:border-brand-primary hover:text-brand-primary transition-all">
                     <Share2 size={20} />
                   </button>
                </div>
              </div>
              <h1 className="text-h1 font-display text-text-primary leading-[1.1]">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 bg-warning/10 text-warning px-3 py-1 rounded-full border border-warning/20">
                  <Star size={14} fill="currentColor" />
                  <span className="text-small font-bold">{(product.averageRating || 4.5).toFixed(1)}</span>
                </div>
                <span className="text-small text-text-muted font-medium underline cursor-pointer hover:text-brand-primary transition-colors">
                  {product.reviewCount || '128'} Ratings & Reviews
                </span>
              </div>
            </div>

            <div className="p-6 bg-surface-secondary/50 rounded-pro border border-border-default relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                  {isDeal && (
                    <div className="bg-danger text-white text-caption font-bold px-3 py-1 rounded-md shadow-xl animate-bounce-subtle">
                      Limited Time Deal
                    </div>
                  )}
               </div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-h1 font-mono font-bold text-text-primary">₹{currentPrice.toLocaleString('en-IN')}</span>
                {isDeal && (
                  <span className="text-small text-danger bg-danger/5 px-2 py-0.5 rounded border border-danger/10 font-bold">
                    -{Math.round((savings / product.price) * 100)}%
                  </span>
                )}
              </div>
              {isDeal && (
                <div className="text-small text-text-muted">
                  List Price: <span className="line-through">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
              )}
              {isDeal && (
                <div className="mt-3 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_#22c55e]" />
                   <span className="text-small font-bold text-success">Save ₹{savings.toLocaleString('en-IN')} right now</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
               {product.variants?.length > 0 && (
                 <div className="space-y-3">
                   <h3 className="text-small font-bold text-text-primary">Available Options</h3>
                   <div className="flex gap-2.5 flex-wrap">
                      {product.variants.map((v, i) => (
                        <button key={i} className="px-4 py-2 border border-border-default rounded-lg text-small font-medium hover:border-brand-primary hover:text-brand-primary transition-all bg-white whitespace-nowrap">
                          {v.name || v}
                        </button>
                      ))}
                   </div>
                 </div>
               )}

              <div className="space-y-4">
                <h3 className="text-small font-bold text-text-primary uppercase tracking-widest">Why shop with us?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="flex gap-3 p-4 bg-white border border-border-default rounded-xl shadow-sm">
                      <Truck className="text-brand-primary" size={20} />
                      <div>
                        <p className="text-caption font-bold text-text-primary leading-none mb-1">Fast Delivery</p>
                        <p className="text-[10px] text-text-muted">Free shipping on orders above ₹499</p>
                      </div>
                   </div>
                   <div className="flex gap-3 p-4 bg-white border border-border-default rounded-xl shadow-sm">
                      <ShieldCheck className="text-success" size={20} />
                      <div>
                        <p className="text-caption font-bold text-text-primary leading-none mb-1">Warranty</p>
                        <p className="text-[10px] text-text-muted">1 Year Comprehensive Coverage</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </section>

          {/* Column 3: Buy Box */}
          <aside className="space-y-4 lg:pb-20">
            <div className="p-6 border border-border-default rounded-pro bg-white shadow-xl lg:sticky lg:top-[120px] ring-1 ring-brand-primary/5">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                    <MapPin size={18} />
                  </div>
                  <div className="text-caption">
                    <p className="font-bold text-text-primary">Delivery to Express</p>
                    <p className="text-text-muted">Ships from ecom.me Hub</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-default/50">
                  {product.stock > 0 ? (
                    <div className="space-y-2">
                       <p className="text-h4 font-bold text-success flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                         In Stock
                       </p>
                       {product.stock < 10 && (
                        <p className="text-caption text-danger font-bold bg-danger/5 px-2 py-1 rounded">
                          Hurry! Only {product.stock} units left.
                        </p>
                       )}
                    </div>
                  ) : (
                    <p className="text-h4 font-bold text-danger uppercase tracking-tighter">Temporarily Out of Stock</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-surface-secondary px-4 py-3 rounded-lg border border-border-default">
                  <span className="text-caption font-bold text-text-secondary">Quantity</span>
                  <select 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-transparent text-small font-bold text-text-primary focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={() => {
                    addItem(product, quantity);
                    toast.success('Added to bag!');
                  }}
                  className="w-full bg-surface-primary border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white py-4 rounded-pro font-bold transition-all flex items-center justify-center gap-2 group"
                >
                   Add to Bag
                   <ShoppingCart size={18} />
                </button>
                <button 
                  onClick={() => {
                    addItem(product, quantity);
                    navigate('/checkout');
                  }}
                  className="w-full text-center bg-brand-primary hover:bg-brand-hover text-white py-4 rounded-pro font-bold transition-all shadow-lg shadow-brand-primary/20"
                >
                  Buy Now
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-border-default flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-caption font-medium text-text-muted">
                  <Info size={16} className="text-text-tertiary" /> 
                  Price includes GST and handling.
                </div>
                <div className="flex items-center gap-2.5 text-caption font-bold text-success capitalize bg-success/5 px-3 py-2 rounded-lg border border-success/10">
                   <ShieldCheck size={16} /> Secure checkout guarantee
                </div>
              </div>
            </div>
          </aside>
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
