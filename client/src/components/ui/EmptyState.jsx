import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  type = 'cart', // 'cart' | 'search' | 'error' | 'orders'
  title, 
  message, 
  actionLabel, 
  actionLink = '/products' 
}) => {
  const configs = {
    cart: {
      icon: ShoppingBag,
      color: 'text-brand-primary',
      bg: 'bg-brand-light/30',
      defaultTitle: 'Your cart is empty',
      defaultMessage: "Looks like you haven't added anything to your cart yet. Discover our latest collections."
    },
    search: {
      icon: Search,
      color: 'text-warning',
      bg: 'bg-warning-light/30',
      defaultTitle: 'No results found',
      defaultMessage: "We couldn't find any products matching your search. Try different keywords or filters."
    },
    error: {
      icon: AlertCircle,
      color: 'text-danger',
      bg: 'bg-danger-light/30',
      defaultTitle: 'Something went wrong',
      defaultMessage: "We're having trouble loading this page. Please check your connection and try again."
    },
    orders: {
      icon: ShoppingBag,
      color: 'text-violet-500',
      bg: 'bg-violet-50/50',
      defaultTitle: 'No orders yet',
      defaultMessage: "You haven't placed any orders yet. Start shopping to see your history here."
    }
  };

  const config = configs[type] || configs.cart;
  const Icon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto"
    >
      <div className={`w-24 h-24 ${config.bg} rounded-full flex items-center justify-center mb-8 relative`}>
        <div className="absolute inset-0 animate-ping bg-current opacity-5 rounded-full" />
        <Icon size={40} className={config.color} />
      </div>
      
      <h2 className="text-h2 font-display text-text-primary mb-3">
        {title || config.defaultTitle}
      </h2>
      <p className="text-text-secondary mb-10 leading-relaxed">
        {message || config.defaultMessage}
      </p>

      {actionLabel && (
        <Link 
          to={actionLink}
          className="bg-brand-primary text-white px-8 py-3 rounded-pill font-bold hover:bg-brand-hover transition-all flex items-center gap-2 group shadow-lg shadow-brand-primary/10"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
};

export default EmptyState;
