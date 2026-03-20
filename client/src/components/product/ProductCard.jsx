import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, Zap, Info, Check } from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '../../context/stores';
import toast from 'react-hot-toast';
import SafeImage from '../ui/SafeImage';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { user, isAuthenticated, toggleWishlist } = useAuthStore();
  const { setActiveModal } = useUIStore();
  
  const [isWishloading, setIsWishLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isInWishlist = user?.wishlist?.includes(product._id || product.id);
  const discount = product.isDeal ? Math.round(((product.price - product.dealPrice) / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return setActiveModal('login');
    
    setIsWishLoading(true);
    try {
      await toggleWishlist(product._id || product.id);
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
      onClick={() => navigate(`/product/${product._id || product.id}`)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-border-default hover:border-brand-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.isDeal && (
          <div className="bg-danger text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
            <Zap size={10} fill="currentColor" />
            {discount}% OFF
          </div>
        )}
        {product.soldCount > 500 && (
          <div className="bg-brand-primary text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
            BEST SELLER
          </div>
        )}
      </div>

      {/* Heart Button */}
      <button 
        onClick={handleWishlist}
        disabled={isWishloading}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${
          isInWishlist 
            ? 'bg-red-500 text-white shadow-lg' 
            : 'bg-white/80 text-text-muted hover:text-red-500 hover:scale-110 shadow-sm'
        }`}
      >
        <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} className={isWishloading ? 'animate-pulse' : ''} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface-secondary">
        <SafeImage
          src={product.images?.[0] || 'https://via.placeholder.com/400'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick Add (Visible on Hover) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center">
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
        <div className="mb-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{product.brand}</span>
        </div>
        
        <h3 className="text-body font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-brand-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-warning">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                fill={i < Math.floor(product.averageRating || 4.5) ? 'currentColor' : 'none'} 
                className={i < Math.floor(product.averageRating || 4.5) ? '' : 'text-border-default'}
              />
            ))}
          </div>
          <span className="text-[11px] text-text-muted font-medium">({product.reviewCount || 128})</span>
        </div>

        {/* Price & Stock */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {product.isDeal ? (
              <>
                <span className="text-caption text-text-muted line-through">₹{product.price.toLocaleString()}</span>
                <span className="text-h4 font-display text-text-primary">₹{product.dealPrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-h4 font-display text-text-primary">₹{product.price.toLocaleString()}</span>
            )}
          </div>
          
          <div className="flex flex-col items-end">
             {product.stock < 10 ? (
               <span className="text-[10px] font-bold text-danger animate-pulse">Only {product.stock} Left!</span>
             ) : (
               <span className="text-[10px] font-bold text-success">In Stock</span>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
