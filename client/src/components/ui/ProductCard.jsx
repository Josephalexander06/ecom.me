import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="min-w-[200px] md:min-w-[240px] bg-white border border-border-main rounded-sm p-4 group transition-all flex flex-col h-full hover:shadow-2xl">
      <div className="relative aspect-[3/4] mb-4 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-text-main text-sm font-medium leading-tight line-clamp-2 mb-1 group-hover:text-accent-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-2">
           <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-accent-success text-white text-[10px] font-bold rounded-sm">
             {product.rating} <Star size={8} fill="currentColor" />
           </div>
           <span className="text-[10px] text-text-muted font-bold">({product.reviews})</span>
           {product.fastDelivery && (
             <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-4 ml-auto" alt="plus" />
           )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold text-text-main">${product.price}</span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-text-muted line-through">${product.originalPrice}</span>
              <span className="text-xs text-accent-success font-bold">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
