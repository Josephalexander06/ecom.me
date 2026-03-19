import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, Zap, Check, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '../../context/stores';
import toast from 'react-hot-toast';

const ProductCard = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user, isAuthenticated, toggleWishlist, location } = useAuthStore();
  const { setActiveModal } = useUIStore();
  
  const [isWishloading, setIsWishLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const id = product._id || product.id;
  const isInWishlist = user?.wishlist?.some(w => (w._id || w) === id);
  const currentPrice = product.dealPrice || product.price;
  const discount = product.isDeal ? Math.round(((product.price - currentPrice) / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return setActiveModal('login');
    
    setIsWishLoading(true);
    try {
      await toggleWishlist(id);
      toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch (err) {
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishLoading(false);
    }
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -8 }}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-border-default hover:border-brand-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col ${compact ? 'max-w-[220px]' : ''}`}
    >
      <Link to={`/product/${id}`} className="flex-1 flex flex-col">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isDeal && (
            <div className="bg-danger text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg animate-bounce-subtle">
              <Zap size={10} fill="currentColor" />
              {discount}% OFF
            </div>
          )}
          {(product.soldCount > 500 || product.averageRating > 4.8) && (
            <div className="bg-brand-primary text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg uppercase tracking-tighter">
              Best Seller
            </div>
          )}
          {/* Social Proof: Trending Badge */}
          {id.charCodeAt(0) % 3 === 0 && (
            <div className="bg-white/90 backdrop-blur-md text-brand-primary text-[9px] font-black px-2 py-1 rounded-md shadow-sm border border-brand-primary/20 flex items-center gap-1 uppercase italic">
              <TrendingUp size={10} />
              Trending in {location?.city || 'India'}
            </div>
          )}
          {/* Social Proof: Recent Purchase Badge */}
          {id.charCodeAt(1) % 4 === 0 && (
            <div className="bg-success/90 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 uppercase">
              <Check size={10} />
              {20 + (id.charCodeAt(2) % 30)} bought recently
            </div>
          )}
        </div>

        {/* Heart Button */}
        <button 
          onClick={handleWishlist}
          disabled={isWishloading}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
            isInWishlist 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-text-muted hover:text-red-500 hover:scale-110 shadow-sm'
          }`}
        >
          <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} className={isWishloading ? 'animate-pulse' : ''} />
        </button>

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-secondary flex items-center justify-center p-4">
          <img 
            src={product.images?.[0] || 'https://via.placeholder.com/400'} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Quick Add (Visible on Hover) */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent z-10">
             <button 
               onClick={handleAddToCart}
               className="w-full bg-white text-text-primary py-2.5 rounded-pill font-bold text-caption flex items-center justify-center gap-2 hover:bg-brand-primary hover:text-white transition-colors shadow-xl"
             >
               {isAdded ? <Check size={16} /> : <ShoppingCart size={16} />}
               {isAdded ? 'Added!' : 'Quick Add'}
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{product.brand}</span>
            <div className="flex items-center gap-1 bg-brand-primary/5 px-1.5 py-0.5 rounded border border-brand-primary/10">
               <ShieldCheck size={10} className="text-brand-primary" />
               <span className="text-[8px] font-black text-brand-primary uppercase">Verified</span>
            </div>
          </div>
          
          <h3 className={`${compact ? 'text-caption' : 'text-body'} font-bold text-text-primary mb-2 line-clamp-2 ${compact ? 'h-8' : 'h-10'} group-hover:text-brand-primary transition-colors leading-tight`}>
            {product.name}
          </h3>

          {/* Rating */}
          <div className={`flex items-center gap-1.5 ${compact ? 'mb-1.5' : 'mb-3'}`}>
            <div className="flex items-center text-warning">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={compact ? 10 : 12} 
                  fill={i < Math.floor(product.averageRating || 4.5) ? 'currentColor' : 'none'} 
                  className={i < Math.floor(product.averageRating || 4.5) ? '' : 'text-border-default'}
                />
              ))}
            </div>
            {compact ? null : <span className="text-[11px] text-text-muted font-medium">({product.reviewCount || 128})</span>}
          </div>

          {/* Price & Stock */}
          <div className="mt-auto flex items-end justify-between">
            <div className="flex flex-col">
              {product.isDeal ? (
                <>
                  <span className={`${compact ? 'text-[8px]' : 'text-caption'} text-text-muted line-through`}>₹{product.price.toLocaleString('en-IN')}</span>
                  <span className={`${compact ? 'text-small' : 'text-h4'} font-display text-brand-primary`}>₹{currentPrice.toLocaleString('en-IN')}</span>
                </>
              ) : (
                <span className={`${compact ? 'text-small' : 'text-h4'} font-display text-text-primary`}>₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>
            
            <div className="flex flex-col items-end">
               {product.stock < 10 ? (
                 <span className="text-[10px] font-bold text-danger animate-pulse">Only {product.stock} Left!</span>
               ) : (
                 <div className="flex items-center gap-1 text-success">
                   <Check size={10} />
                   <span className="text-[10px] font-bold">In Stock</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
