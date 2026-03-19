import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Zap, Check } from 'lucide-react';
import { useAuthStore, useCartStore, useUIStore } from '../../context/stores';
import toast from 'react-hot-toast';

const ProductCard = ({ product, compact = false }) => {
  const { addItem } = useCartStore();
  const { user, isAuthenticated, toggleWishlist } = useAuthStore();
  const { setActiveModal } = useUIStore();

  const [isWishloading, setIsWishLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const id = product._id || product.id;
  const isInWishlist = user?.wishlist?.some((w) => (w._id || w) === id);
  const currentPrice = product.dealPrice || product.price;
  const discount = product.isDeal ? Math.round(((product.price - currentPrice) / product.price) * 100) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setIsAdded(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={`group panel overflow-hidden h-full flex flex-col ${compact ? 'max-w-[238px]' : ''}`}
    >
      <Link to={`/product/${id}`} className="flex flex-col flex-1">
        <div className="relative aspect-[4/5] bg-gradient-to-b from-slate-100 to-slate-50 p-4 md:p-5 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            {product.isDeal && (
              <span className="inline-flex items-center gap-1 rounded-md bg-danger px-2 py-1 text-[10px] font-bold text-white">
                <Zap size={10} />
                {discount}% OFF
              </span>
            )}
            {product.soldCount > 500 && (
              <span className="rounded-md bg-brand-primary/90 px-2 py-1 text-[10px] font-bold text-white">
                BESTSELLER
              </span>
            )}
          </div>

          <button
            onClick={handleWishlist}
            disabled={isWishloading}
            className={`absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-full border transition-all ${
              isInWishlist
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white/85 text-text-muted border-border-default hover:text-rose-500'
            }`}
          >
            <Heart size={17} fill={isInWishlist ? 'currentColor' : 'none'} className={isWishloading ? 'animate-pulse' : ''} />
          </button>

          <div className="absolute inset-x-3 bottom-3 translate-y-16 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250">
            <button
              onClick={handleAddToCart}
              className="w-full rounded-xl bg-slate-950 text-white py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-2 hover:bg-brand-primary transition-colors"
            >
              {isAdded ? <Check size={15} /> : <ShoppingCart size={15} />}
              {isAdded ? 'Added' : 'Quick Add'}
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted truncate">{product.brand}</span>
            <span className="text-[10px] text-text-muted">{product.reviewCount || 128} reviews</span>
          </div>

          <h3 className={`mt-2 font-semibold text-text-primary leading-tight line-clamp-2 ${compact ? 'text-sm min-h-[40px]' : 'text-base min-h-[44px]'}`}>
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex text-rating">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={compact ? 10 : 12}
                  fill={i < Math.floor(product.averageRating || 4.5) ? 'currentColor' : 'none'}
                  className={i < Math.floor(product.averageRating || 4.5) ? '' : 'text-border-default'}
                />
              ))}
            </div>
            <span className="text-[11px] text-text-muted font-medium">{(product.averageRating || 4.5).toFixed(1)}</span>
          </div>

          <div className="mt-auto pt-3 flex items-end justify-between gap-2">
            <div>
              {product.isDeal ? (
                <>
                  <p className="text-[11px] text-text-muted line-through">₹{product.price.toLocaleString('en-IN')}</p>
                  <p className="text-lg font-display font-bold text-brand-primary">₹{currentPrice.toLocaleString('en-IN')}</p>
                </>
              ) : (
                <p className="text-lg font-display font-bold text-text-primary">₹{product.price.toLocaleString('en-IN')}</p>
              )}
            </div>
            <span className={`text-[11px] font-semibold ${product.stock < 10 ? 'text-danger' : 'text-success'}`}>
              {product.stock < 10 ? `${product.stock} left` : 'In stock'}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;
