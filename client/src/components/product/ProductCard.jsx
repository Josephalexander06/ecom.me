import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import Tilt from "react-parallax-tilt";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Tilt options={{ max: 15, scale: 1.02, speed: 400 }}>
      <motion.div 
        layout
        initial="rest"
        whileHover="hover"
        onClick={() => navigate(`/product/${product.id}`)}
        className="product-card h-[480px] glass rounded-[2.5rem] p-6 relative group cursor-pointer overflow-hidden border border-white/5 hover:border-accent-primary/50 transition-colors duration-500"
      >
        {/* Wishlist Heart */}
        <button className="absolute top-6 right-6 z-20 text-black/10 hover:text-red-500 transition-colors">
          <Heart size={20} />
        </button>

        {/* Dynamic Glow */}
        <div 
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-[80px]"
          style={{ backgroundColor: product.dominantColor || '#00f2ff' }}
        />

        {/* Product Image Container */}
        <div className="w-full h-[65%] rounded-3xl overflow-hidden bg-white/5 mb-6 relative">
          <img 
            src={product.images[0] || 'https://via.placeholder.com/400'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Holographic Specs Overlay */}
          <motion.div 
            variants={{
              rest: { opacity: 0, scale: 0.8 },
              hover: { opacity: 1, scale: 1 }
            }}
            className="absolute inset-x-0 top-0 h-[65%] bg-accent-primary/10 backdrop-blur-xl flex flex-col items-center justify-center p-8 pointer-events-none z-10"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-accent-primary shadow-[0_0_15px_var(--accent-primary)] animate-scan" />
            
            <div className="space-y-4 w-full relative z-20">
                <div className="flex justify-between items-center border-b border-accent-primary/20 pb-2">
                    <span className="font-mono text-[8px] uppercase text-accent-primary/60">Latency</span>
                    <span className="font-display text-xs text-text-main italic">0.2ms</span>
                </div>
                <div className="flex justify-between items-center border-b border-accent-primary/20 pb-2">
                    <span className="font-mono text-[8px] uppercase text-accent-primary/60">Logic Rev</span>
                    <span className="font-display text-xs text-text-main italic">X-92</span>
                </div>
                <div className="flex justify-between items-center border-b border-accent-primary/20 pb-2">
                    <span className="font-mono text-[8px] uppercase text-accent-primary/60">Sync Cap</span>
                    <span className="font-display text-xs text-text-main italic">800 GB/s</span>
                </div>
                <div className="mt-4 text-center">
                    <div className="inline-block px-3 py-1 bg-accent-primary/20 rounded-full border border-accent-primary/20 font-mono text-[7px] text-accent-primary uppercase tracking-widest">
                        Scanning Neural ID...
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-6 gap-3 z-20">
            <button className="w-full py-3 rounded-xl bg-accent-primary text-black font-display text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <ShoppingCart size={14} />
              Add to Sync
            </button>
            <button className="w-full py-3 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/10 font-display text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
              <Eye size={14} />
              Quick View
            </button>
          </div>
        </div>

        {/* Text Content */}
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.3em]">
                {product.brand}
              </span>
              <h3 className="text-xl font-display text-text-main mt-1 leading-tight group-hover:text-accent-primary transition-colors">
                {product.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xl font-mono text-text-main">${product.price}</span>
            </div>
          </div>

          {/* Stock Pulse Indicator */}
          <div className="mt-6 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 10 ? 'bg-red-500 animate-pulse shadow-[0_0_8px_red]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} />
            <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">
              {product.stock < 10 ? `Limited Logic: ${product.stock} Units` : 'Neural-Stream Stable'}
            </span>
          </div>
        </div>
      </motion.div>
    </Tilt>
  );
};

export default ProductCard;
