import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingCart, User, Menu, X, 
  ChevronDown, MapPin, Package, Heart,
  TrendingUp, Globe, Box
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All');
  const location = useLocation();
  const isHome = location.pathname === '/';

  const categories = [
    'All', 'Neural Links', 'Retinal Inserts', 'Haptic Gear', 'Cognitive', 'Bionics'
  ];

  const subLinks = [
    "Today's Deals", "Electronics", "Wearables", "Neural Devices", 
    "Fashion", "Home", "Books", "Seller Central"
  ];

  const trending = [
    "Neural Link V4", "Somatic Glove", "Iris Pro", "Synapse-X", "Bio-Thread"
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="w-full flex flex-col z-[100] font-body shadow-sm sticky top-0">
      {/* ROW 1: Identity & Primary Utility */}
      <div className="bg-accent-primary h-14 md:h-16 flex items-center px-4 md:px-8 gap-4 md:gap-8 border-b border-accent-primary shadow-md">
        {/* Mobile Hamburger (Only visible on Mobile) */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden text-white p-2"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-5 h-5 bg-white rounded-[2px] rotate-45 group-hover:bg-accent-warning transition-all" />
          <span className="font-display text-xl tracking-tighter text-white font-extrabold italic">AETHER</span>
        </Link>

        {/* Desktop Search - 50% Width */}
        <div className="hidden lg:flex flex-1 max-w-[55%] h-9 md:h-10 group relative shadow-md rounded-sm overflow-hidden">
          <div className="flex w-full h-full bg-white">
            <input 
              type="text" 
              placeholder="Search for products, brands and more" 
              className="flex-1 px-4 bg-transparent text-text-main text-sm focus:outline-none placeholder:text-text-dim"
            />
            <button className="h-full px-4 text-accent-primary hover:text-accent-secondary transition-colors">
              <Search size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Desktop Utility Actions */}
        <div className="hidden lg:flex items-center gap-2 ml-auto">
          <Link to="/login" className="px-10 py-1.5 bg-white text-accent-primary font-bold text-sm rounded-sm hover:bg-bg-secondary transition-all shadow-sm">
            Login
          </Link>

          <Link to="/seller/dashboard" className="text-white text-sm font-bold px-4 hover:underline">
            Become a Seller
          </Link>

          <Link to="/orders" className="text-white text-sm font-bold px-4 hover:underline">
            Orders
          </Link>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 text-white px-4 group"
          >
            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold">Cart</span>
            <span className="w-5 h-5 bg-accent-warning text-white text-[10px] font-extrabold flex items-center justify-center rounded-sm">0</span>
          </button>
        </div>

        {/* Mobile Icons (Visible on Mobile only) */}
        <div className="lg:hidden flex items-center gap-4 ml-auto">
           <button className="text-white relative">
             <ShoppingCart size={24} />
             <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-warning text-white text-[9px] font-bold flex items-center justify-center rounded-full">0</span>
           </button>
        </div>
      </div>

      <div className="bg-bg-primary h-10 flex items-center px-4 md:px-8 border-b border-border-main">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center gap-1 text-text-main font-bold text-sm h-full px-2 hover:border border-transparent hover:border-black/5 transition-all"
        >
          <Menu size={20} />
          <span className="hidden sm:inline tracking-tight">All</span>
        </button>

        <div className="hidden md:flex items-center h-full gap-2 lg:gap-4 ml-2 overflow-hidden">
          {subLinks.map((link) => (
            <a 
              key={link} 
              href="#" 
              className="text-text-main text-xs px-2 h-full flex items-center border border-transparent hover:border-black/10 transition-all whitespace-nowrap tracking-tight"
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      {/* ROW 3: Location Bar & Mobile Search (Sticky) */}
      <AnimatePresence>
        {isHome && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="bg-bg-surface flex items-center px-4 md:px-8 overflow-hidden py-1.5 gap-8 border-b border-border-main"
          >
             <div className="flex items-center gap-1.5 text-text-main hover:text-accent-primary cursor-pointer transition-colors whitespace-nowrap group">
                <MapPin size={16} className="text-accent-primary" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-text-muted leading-tight uppercase tracking-widest font-bold">Deliver to</span>
                  <span className="text-[10px] font-bold group-hover:underline">New Delhi 110001</span>
                </div>
             </div>

             <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth">
                <span className="text-[10px] text-accent-primary uppercase tracking-[0.2em] font-extrabold whitespace-nowrap flex items-center gap-2">
                  <TrendingUp size={12} strokeWidth={3} /> Trending:
                </span>
                {trending.map((term) => (
                  <button 
                    key={term}
                    className="whitespace-nowrap hover:text-accent-primary text-[10px] text-text-muted transition-all uppercase tracking-tighter font-bold"
                  >
                    {term}
                  </button>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
