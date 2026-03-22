import React, { useMemo, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  Truck,
  MapPin,
  Star,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuthStore, useCartStore, useUIStore } from '../context/stores';
import { API_BASE, authHeaders } from '../utils/api';
import ImageZoom from '../components/product/ImageZoom';
import ProductRow from '../components/home/ProductRow';
import SafeImage from '../components/ui/SafeImage';
import RecentlyViewed from '../components/product/RecentlyViewed';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loadingProducts, refreshProducts } = useStore();
  const { trackProduct, addItem } = useCartStore();
  const { user, isAuthenticated, toggleWishlist } = useAuthStore();
  const { setActiveModal } = useUIStore();

  const safeProducts = useMemo(
    () => (Array.isArray(products) ? products.filter((item) => item && typeof item === 'object') : []),
    [products]
  );
  const product = useMemo(() => safeProducts.find((item) => (item._id || item.id) === id), [safeProducts, id]);

  useEffect(() => {
    if (product) trackProduct(product);
  }, [product, trackProduct]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isWishloading, setIsWishLoading] = useState(false);
  const [showFloatingIcon, setShowFloatingIcon] = useState(false);
  const [showARPreview, setShowARPreview] = useState(false);

  // 2040 Hesitation Engine State
  const [hasHesitated, setHasHesitated] = useState(false);
  const [hesitationTimer, setHesitationTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (!hasHesitated) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setHasHesitated(false);
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [hasHesitated]);

  const handleMouseEnterCTA = () => {
    if (hasHesitated) return;
    const timer = setTimeout(() => {
      setHasHesitated(true);
    }, 2000); 
    setHesitationTimer(timer);
  };

  const handleMouseLeaveCTA = () => {
    if (hesitationTimer) clearTimeout(hesitationTimer);
  };

  const clearHesitation = () => {
    if (hesitationTimer) clearTimeout(hesitationTimer);
    setHasHesitated(false);
  };

  if (loadingProducts) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-light border-t-brand-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-text-muted">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="panel p-8 md:p-10 text-center max-w-xl">
          <h2 className="text-3xl font-display font-bold tracking-tight">Product not found</h2>
          <p className="mt-3 text-text-secondary">This item may have been removed or the link is invalid.</p>
          <Link to="/products" className="mt-6 inline-flex h-11 items-center rounded-xl bg-brand-primary px-5 text-white font-semibold hover:bg-brand-hover">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const isInWishlist = Array.isArray(user?.wishlist)
    ? user.wishlist.some((w) => (w?._id || w) === id)
    : false;
  const productName = typeof product.name === 'string' || typeof product.name === 'number'
    ? String(product.name)
    : 'Untitled Product';
  const productBrand = typeof product.brand === 'string' || typeof product.brand === 'number'
    ? String(product.brand)
    : 'Unbranded';
  const productCategory = typeof product.category === 'string' || typeof product.category === 'number'
    ? String(product.category)
    : 'General';
  const productDescription = typeof product.description === 'string' || typeof product.description === 'number'
    ? String(product.description)
    : 'No description provided yet.';
  const productImagesRaw = Array.isArray(product.images)
    ? product.images
    : product.images
      ? [product.images]
      : [];
  const productImages = productImagesRaw.length
    ? productImagesRaw
    : ['https://via.placeholder.com/800'];
  const basePrice = Number(product.price || 0);
  const currentPrice = Number(product.dealPrice || product.price || 0);
  const isDeal = Boolean(product.isDeal && Number(product.dealPrice || 0) > 0);
  const savings = Math.max(basePrice - currentPrice, 0);
  const averageRating = Number(product.averageRating || 4.5);
  const ratingValue = Number.isFinite(averageRating) ? averageRating : 4.5;
  const reviewCount = Number(product.reviewCount || 128);
  const formatVariantLabel = (variant) => {
    if (variant === null || variant === undefined) return 'Option';
    if (typeof variant === 'string' || typeof variant === 'number') return String(variant);
    if (typeof variant === 'object') {
      if (variant.name) return String(variant.name);
      const bits = [variant.color, variant.size]
        .filter((v) => typeof v === 'string' || typeof v === 'number')
        .map(String);
      if (typeof variant.priceDelta === 'number' && variant.priceDelta !== 0) {
        bits.push(`${variant.priceDelta > 0 ? '+' : '-'}₹${Math.abs(variant.priceDelta)}`);
      }
      return bits.length ? bits.join(' · ') : 'Option';
    }
    return 'Option';
  };

  const similarProducts = safeProducts
    .filter((p) => p?.category === productCategory && (p._id || p.id) !== id)
    .slice(0, 10);

  const bundleProducts = similarProducts.slice(0, 2);

  const handleWishlist = async () => {
    if (!isAuthenticated) return setActiveModal('login');

    setIsWishLoading(true);
    try {
      await toggleWishlist(id);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
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
        body: JSON.stringify({ rating, comment }),
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
    <div className="min-h-screen pb-12">
      <section className="site-shell pt-4">
        <div className="text-xs text-text-muted inline-flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
          <Link to="/products" className="hover:text-brand-primary">Products</Link>
          <ChevronRight size={12} />
          <Link to={`/products?category=${productCategory}`} className="hover:text-brand-primary">{productCategory}</Link>
          <ChevronRight size={12} />
          <span className="truncate text-text-secondary">{productName}</span>
        </div>
      </section>

      <section className="site-shell mt-4 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 xl:gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-[110px_1fr] gap-4">
          <div className="order-2 lg:order-1 flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible no-scrollbar">
            {productImages.map((img, idx) => (
              <button
                key={img + idx}
                onClick={() => setSelectedImage(idx)}
                className={`shrink-0 h-20 w-20 rounded-xl border overflow-hidden ${selectedImage === idx ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-border-default'}`}
              >
                <SafeImage src={img} alt={`${productName} ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="order-1 lg:order-2 panel overflow-hidden">
            <div className="relative">
              <ImageZoom src={productImages[selectedImage] || productImages[0]} alt={productName} />
              <button
                onClick={() => setShowARPreview(true)}
                className="absolute bottom-4 right-4 rounded-pill border border-border-default bg-white/90 backdrop-blur px-4 py-2 text-[11px] font-semibold text-brand-primary hover:bg-brand-primary hover:text-white transition-colors"
              >
                View in your space
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="panel p-5 md:p-6 xl:sticky xl:top-[110px] space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link to={`/products?brand=${encodeURIComponent(productBrand)}`} className="text-xs font-bold uppercase tracking-[0.14em] text-brand-primary hover:underline">
                  {productBrand}
                </Link>
                <h1 className="mt-2 text-2xl md:text-3xl font-display font-bold tracking-tight text-balance">{productName}</h1>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWishlist}
                  className={`h-10 w-10 grid place-items-center rounded-full border transition-colors ${
                    isInWishlist ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white border-border-default text-text-muted hover:text-rose-500'
                  }`}
                >
                  <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} className={isWishloading ? 'animate-pulse' : ''} />
                </button>
                <button className="h-10 w-10 grid place-items-center rounded-full border border-border-default text-text-muted hover:text-brand-primary">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-pill bg-warning-light border border-warning/20 px-3 py-1.5 text-sm text-warning">
              <Star size={14} fill="currentColor" />
              <span className="font-semibold">{ratingValue.toFixed(1)}</span>
              <span className="text-xs text-text-muted">({reviewCount} ratings)</span>
            </div>

            <div className="rounded-2xl border border-border-default bg-surface-secondary/70 p-4">
              <div className="flex items-baseline gap-3">
                <p className="text-3xl md:text-4xl font-display font-bold text-text-primary">₹{currentPrice.toLocaleString('en-IN')}</p>
                {isDeal && <p className="text-sm text-text-muted line-through">₹{basePrice.toLocaleString('en-IN')}</p>}
              </div>
              {isDeal && (
                <p className="mt-2 inline-flex rounded-md bg-danger/10 text-danger text-xs font-semibold px-2 py-1">
                  Save ₹{savings.toLocaleString('en-IN')}
                </p>
              )}
              <div className="mt-3 pt-3 border-t border-border-default text-xs text-text-secondary space-y-1.5">
                <p className="inline-flex items-center gap-2"><Truck size={14} className="text-brand-primary" /> Fast delivery available</p>
                <p className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-success" /> 100% secure checkout</p>
                <p className="inline-flex items-center gap-2"><MapPin size={14} className="text-text-muted" /> Ships from trusted seller network</p>
              </div>
            </div>

            <div className="rounded-xl border border-border-default bg-white p-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-text-secondary">Quantity</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-lg border border-border-default px-2.5 py-1.5 text-sm font-semibold"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div 
              className="space-y-2.5 relative z-20"
              onMouseEnter={handleMouseEnterCTA}
              onMouseLeave={handleMouseLeaveCTA}
            >
              <AnimatePresence>
                {hasHesitated && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
                    className="absolute bottom-[calc(100%+8px)] left-0 w-full rounded-2xl border border-white/20 bg-brand-primary/95 backdrop-blur-md p-4 shadow-2xl z-30 text-white select-none overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite]" />
                    <div className="flex items-start gap-3 relative z-10 w-full">
                      <div className="mt-0.5 rounded-full bg-white/20 p-1.5 animate-pulse shrink-0">
                        <Sparkles size={16} className="text-amber-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold tracking-tight">Still deciding?</p>
                        <p className="text-xs text-white/90 mt-1 leading-[1.6]">
                          Checkout in the next <span className="font-mono font-bold text-amber-300 bg-black/20 px-1 py-0.5 mx-0.5 rounded">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span> to instantly unlock <span className="font-bold underline decoration-amber-300 decoration-2 underline-offset-2">10% OFF</span>.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        clearHesitation();
                        addItem(product, quantity);
                        navigate('/checkout?promo=HESITATE10'); 
                      }}
                      className="mt-4 w-full h-10 rounded-xl border border-white/30 bg-white/15 hover:bg-white/25 active:bg-white/30 text-xs font-bold transition-all flex items-center justify-center gap-2 relative z-10"
                    >
                      Claim 10% Off & Checkout
                      <ChevronRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showFloatingIcon && (
                  <motion.div
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -80, opacity: 0, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 -top-8 z-10 pointer-events-none"
                  >
                    <div className="h-10 w-10 rounded-full bg-brand-primary text-white grid place-items-center shadow-premium">
                      <ShoppingCart size={18} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => {
                  clearHesitation();
                  addItem(product, quantity);
                  setShowFloatingIcon(true);
                  setTimeout(() => setShowFloatingIcon(false), 800);
                  toast.success('Added to bag');
                }}
                className="w-full h-11 rounded-xl border-2 border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white transition-colors inline-flex items-center justify-center gap-2"
              >
                Add to Bag
                <ShoppingCart size={16} />
              </button>
              <button
                onClick={() => {
                  clearHesitation();
                  addItem(product, quantity);
                  navigate('/checkout');
                }}
                className="w-full h-11 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors inline-flex items-center justify-center gap-2"
              >
                Buy now
                <ShoppingBag size={16} />
              </button>
            </div>

            <div className="pt-4 border-t border-border-default text-xs text-text-muted inline-flex items-start gap-2">
              <CheckCircle2 size={15} className="text-success shrink-0 mt-0.5" />
              <span>Price includes tax. Buyer protection applies to all prepaid and COD orders.</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="site-shell mt-7 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="panel p-5 md:p-6">
          <h2 className="text-lg font-display font-bold tracking-tight">Product Description</h2>
          <p className="mt-3 text-sm text-text-secondary whitespace-pre-line leading-relaxed">{productDescription}</p>
          {!!product.variants?.length && (
            <div className="mt-4 pt-4 border-t border-border-default">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted mb-2">Available Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => (
                  <span key={`${variant?._id || 'variant'}-${idx}`} className="rounded-lg border border-border-default bg-white px-3 py-1.5 text-sm text-text-secondary">
                    {formatVariantLabel(variant)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="panel p-5 md:p-6">
          <h2 className="text-lg font-display font-bold tracking-tight">Write a review</h2>
          <form onSubmit={submitReview} className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-text-secondary">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="rounded-lg border border-border-default px-2.5 py-1.5 text-sm"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} Star</option>
                ))}
              </select>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share product quality, value, and delivery experience"
              className="w-full min-h-[120px] rounded-xl border border-border-default px-3 py-2.5 text-sm focus:outline-none focus:border-brand-primary"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="h-10 rounded-xl bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-brand-hover disabled:opacity-70 inline-flex items-center gap-2"
            >
              <Sparkles size={14} />
              {submittingReview ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        </div>
      </section>

      <section className="site-shell mt-8">
        <div className="panel p-5 md:p-6">
          <h2 className="text-lg font-display font-bold tracking-tight">Frequently Bought Together</h2>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-start">
            <div className="flex flex-wrap items-center gap-4">
              {[product, ...bundleProducts].map((p, idx) => (
                <React.Fragment key={p._id || p.id || idx}>
                  <div className="w-28">
                    <div className="aspect-square rounded-xl border border-border-default bg-white p-3 overflow-hidden">
                      <SafeImage
                        src={Array.isArray(p.images) ? p.images[0] : p.images || 'https://via.placeholder.com/400'}
                        alt={p.name || 'Product'}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="mt-2 text-xs text-text-secondary line-clamp-2">{p.name || 'Untitled Product'}</p>
                  </div>
                  {idx < 2 && <span className="text-xl text-text-muted">+</span>}
                </React.Fragment>
              ))}
            </div>

            <div className="rounded-2xl border border-border-default bg-surface-secondary/60 p-4">
              <p className="text-sm text-text-secondary">Bundle Price</p>
              <p className="text-2xl font-display font-bold text-brand-primary mt-1">₹{(basePrice * 2.4).toLocaleString('en-IN')}</p>
              <button
                onClick={() => {
                  addItem(product);
                  bundleProducts.forEach((p) => addItem(p));
                  toast.success('Bundle added to bag');
                }}
                className="mt-3 w-full h-10 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hover"
              >
                Add bundle
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell mt-8">
        <div className="panel p-4 md:p-6">
          <ProductRow eyebrow="YOU MAY LIKE" title="Similar Products" products={similarProducts} />
        </div>
      </section>

      <RecentlyViewed title="Recently Browsed" limit={6} />

      <AnimatePresence>
        {showARPreview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowARPreview(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              aria-label="Close AR preview"
            />
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative w-full max-w-2xl panel overflow-hidden"
            >
              <div className="p-4 md:p-5 border-b border-border-default flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-bold">AR Preview</h3>
                  <p className="text-xs text-text-muted">Move the product to estimate real-world fit</p>
                </div>
                <button onClick={() => setShowARPreview(false)} className="text-sm font-semibold text-text-secondary hover:text-text-primary">Close</button>
              </div>

              <div className="aspect-[4/3] bg-surface-secondary relative grid place-items-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30" />
                <motion.img
                  drag
                  dragConstraints={{ left: -120, right: 120, top: -80, bottom: 80 }}
                  src={productImages[selectedImage] || productImages[0]}
                  alt="AR Preview"
                  className="relative z-10 h-56 w-56 object-contain drop-shadow-2xl cursor-move"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;
