import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  User, 
  ShoppingBag, 
  ChevronDown, 
  Menu, 
  LayoutGrid, 
  TrendingUp,
  X
} from 'lucide-react';
import { useAuthStore, useUIStore, useCartStore } from '../../context/stores';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { setActiveModal, isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { items } = useCartStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Electronics', 'Mobiles', 'Fashion', 'Home', 'Books', 'Beauty'];
  const trendingSearches = ['iPhone 15 Pro', 'Wireless Earbuds', 'Summer Collection', 'Smart Home'];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
    }
  };

  return (
    <nav className="w-full bg-white relative z-[50]">
      {/* Row 1: Brand & Utility (64px) */}
      <div className="h-[64px] border-b border-border-default px-4 md:px-8 flex items-center gap-6 max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="font-display font-extrabold text-xl tracking-tight text-text-primary">
            ecom<span className="text-brand-primary">.me</span>
          </h1>
        </Link>

        {/* Deliver To (Desktop) */}
        <button className="hidden lg:flex items-center gap-2 group flex-shrink-0 text-left">
          <MapPin size={22} className="text-brand-primary" />
          <div className="flex flex-col">
            <span className="text-[11px] leading-tight text-text-secondary">Deliver to</span>
            <span className="text-small font-bold text-text-primary group-hover:text-brand-primary transition-colors flex items-center gap-0.5">
              Select Location <ChevronDown size={12} />
            </span>
          </div>
        </button>

        {/* Search Bar (45%) */}
        <form 
          onSubmit={handleSearch}
          className="flex-1 max-w-[45%] h-10 flex items-center bg-surface-secondary border border-border-default rounded-pill overflow-hidden focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-light transition-all shadow-sm"
        >
          <div className="h-full border-r border-border-default px-3 flex items-center gap-1.5 cursor-pointer hover:bg-surface-tertiary transition-colors">
            <span className="text-small font-medium text-text-secondary whitespace-nowrap">{selectedCategory}</span>
            <ChevronDown size={14} className="text-text-muted" />
          </div>
          <input 
            type="text"
            placeholder="Search products, brands and more..."
            className="flex-1 bg-transparent px-4 py-2 text-small text-text-primary placeholder:text-text-muted focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="h-full px-5 bg-brand-primary text-white hover:bg-brand-hover transition-colors">
            <Search size={18} />
          </button>
        </form>

        {/* Utility Icons */}
        <div className="flex items-center gap-4 md:gap-6 ml-auto">
          {/* Account */}
          <div className="relative group cursor-pointer flex-shrink-0">
            <div 
              onClick={() => !isAuthenticated && setActiveModal('login')}
              className="flex items-center gap-2"
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[11px] leading-tight text-text-secondary">Hello, {user?.name?.split(' ')[0] || 'Sign In'}</span>
                <span className="text-small font-bold text-text-primary flex items-center gap-0.5">
                  Account <ChevronDown size={12} className="text-text-muted" />
                </span>
              </div>
              <User size={24} className="text-text-primary lg:hidden" />
            </div>
            
            {/* Account Dropdown */}
            {isAuthenticated && (
              <div className="absolute top-full right-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all">
                <div className="bg-white border border-border-default rounded-pro shadow-premium p-2 min-w-[200px]">
                  <Link to="/profile" className="block px-4 py-2 text-small hover:bg-surface-secondary rounded-lg transition-colors">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-small hover:bg-surface-secondary rounded-lg transition-colors">Orders & Returns</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-small hover:bg-surface-secondary rounded-lg transition-colors">Wishlist</Link>
                  <div className="border-t border-border-default my-1" />
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-small text-danger hover:bg-danger/5 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orders (Desktop Only) */}
          <Link to="/orders" className="hidden lg:flex flex-col flex-shrink-0">
            <span className="text-[11px] leading-tight text-text-secondary">Returns</span>
            <span className="text-small font-bold text-text-primary">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative group flex items-center gap-2">
            <div className="relative">
              <ShoppingBag size={24} className="text-text-primary group-hover:text-brand-primary transition-colors" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={cartCount}
                  className="absolute -top-1.5 -right-1.5 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </div>
            <span className="hidden lg:block text-small font-bold text-text-primary group-hover:text-brand-primary transition-colors">
              Cart
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => toggleMobileMenu()}
            className="lg:hidden p-1 text-text-primary"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Row 2: Category Navigation (40px) */}
      <div className="hidden md:block h-[40px] bg-surface-secondary border-b border-border-default px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-small font-bold text-text-primary hover:text-brand-primary transition-colors">
              <LayoutGrid size={16} /> All Departments
            </button>
            <div className="h-4 w-[1px] bg-border-strong mx-1" />
            
            {categories.slice(1).map((cat) => (
              <Link 
                key={cat} 
                to={`/products?category=${cat}`}
                className="text-small text-text-secondary font-medium hover:text-text-primary transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          <Link 
            to="/seller/onboarding" 
            className="text-small font-bold text-warning hover:underline flex items-center gap-1.5"
          >
            Sell on ecom.me
          </Link>
        </div>
      </div>

      {/* Row 3: Location & Trending (36px) — Home Only context would usually go here */}
      <div className="h-[36px] bg-white border-b-2 border-brand-primary/10 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-caption font-medium text-text-muted">Delivering to:</span>
            <span className="text-caption font-bold text-text-secondary">New York, 10001</span>
          </div>

          <div className="hidden lg:flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            <span className="flex items-center gap-1.5 text-caption font-bold text-brand-primary">
              <TrendingUp size={12} /> TRENDING
            </span>
            {trendingSearches.map((term) => (
              <button 
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  navigate(`/products?q=${encodeURIComponent(term)}`);
                }}
                className="px-3 py-1 bg-surface-secondary text-caption text-text-secondary rounded-full hover:bg-surface-tertiary hover:text-text-primary transition-all whitespace-nowrap"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => toggleMobileMenu(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] lg:hidden shadow-lg flex flex-col"
            >
              <div className="p-6 border-b border-border-default flex items-center justify-between bg-surface-secondary">
                <h2 className="font-display font-bold text-xl">Menu</h2>
                <button onClick={() => toggleMobileMenu(false)}><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-2">
                  <p className="text-caption font-bold text-text-muted uppercase tracking-wider">Account</p>
                  {!isAuthenticated ? (
                    <button 
                      onClick={() => { toggleMobileMenu(false); setActiveModal('login'); }}
                      className="w-full text-left py-2 font-bold text-brand-primary"
                    >
                      Sign In / Register
                    </button>
                  ) : (
                    <div className="py-2">
                      <p className="font-bold">Hello, {user.name}</p>
                      <button onClick={logout} className="text-danger text-small">Logout</button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-caption font-bold text-text-muted uppercase tracking-wider">Shop by Category</p>
                  {categories.map(cat => (
                    <Link 
                      key={cat} 
                      to={`/products?category=${cat}`}
                      onClick={() => toggleMobileMenu(false)}
                      className="block py-2 text-text-secondary hover:text-text-primary"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
