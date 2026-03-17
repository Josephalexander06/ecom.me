import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../context/stores';

const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();

  const id = product._id || product.id;
  const currentPrice = product.dealPrice || product.price;
  const discount = Math.round(((product.price - currentPrice) / product.price) * 100);

  return (
    <motion.article 
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative bg-white border border-border-default rounded-pro transition-all duration-300 hover:shadow-md overflow-hidden h-full flex flex-col"
    >
      {/* Image Container */}
      <Link to={`/product/${id}`} className="block aspect-[4/5] p-0 relative overflow-hidden bg-surface-secondary rounded-t-pro">
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-4">
          <img 
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'} 
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Deal Badge */}
        {product.isDeal && (
          <div className="absolute top-5 left-5 bg-warning text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg z-10 animate-pulse-subtle">
            {discount}% OFF
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${id}`} className="block group/title">
          <h3 className="text-small font-medium text-text-primary line-clamp-2 leading-tight group-hover/title:text-brand-primary transition-colors min-h-[40px]">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center text-rating">
            <Star size={12} fill="currentColor" />
            <span className="text-caption font-bold ml-1">{product.averageRating || '4.5'}</span>
          </div>
          <span className="text-caption text-text-muted">({product.reviewCount || '1.2k'})</span>
        </div>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-body font-bold text-brand-primary font-mono">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {product.isDeal && (
              <span className="text-caption text-text-muted line-through">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button — Slide up on hover or always on mobile */}
        <div className="mt-4 md:mt-0 md:absolute md:bottom-0 md:left-0 md:right-0 md:p-4 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
          <button 
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="w-full h-10 bg-brand-primary hover:bg-brand-hover text-white rounded-pill flex items-center justify-center gap-2 text-small font-bold"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
