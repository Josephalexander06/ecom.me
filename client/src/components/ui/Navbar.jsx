import React, { useState, useMemo, useEffect } from 'react';
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
import { useStore } from '../../context/StoreContext';
import LocationModal from './LocationModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, location, hasSetLocation, detectLocation } = useAuthStore();
  const { setActiveModal, isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { items } = useCartStore();
  const { products } = useStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!hasSetLocation) {
      detectLocation().catch(() => {
        // Silent fail if permission denied, but at least we tried
      });
    }
  }, [hasSetLocation, detectLocation]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categories = ['All', 'Electronics', 'Mobiles', 'Fashion', 'Home', 'Books', 'Beauty', 'Groceries'];
  const trendingSearches = ['iPhone 15', 'Silk Sarees', 'Running Shoes', 'Smart Watches', 'Kitchenware'];

  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    return (products || [])
      .filter(p => 
        p && (
          (p.name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
          (p.brand?.toLowerCase().includes(searchQuery.toLowerCase()))
        ) &&
        (selectedCategory === 'All' || p.category === selectedCategory)
      )
      .slice(0, 6);
  }, [searchQuery, products, selectedCategory]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
    }
  };

  return (
    <nav className="w-full bg-white relative z-[50]">
      {/* Row 1: Brand & Utility (64px) */}
      <div className="h-[72px] md:h-[64px] border-b border-border-default px-4 md:px-8 flex items-center gap-4 md:gap-6 max-w-[1400px] mx-auto">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => toggleMobileMenu()}
          className="lg:hidden p-1 text-text-primary hover:bg-surface-secondary rounded-lg transition-colors"
        >
          <Menu size={26} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="font-display font-black text-2xl tracking-tighter text-text-primary italic">
            ecom<span className="text-brand-primary">.me</span>
          </h1>
        </Link>

        {/* Deliver To (Desktop) */}
        <button 
          onClick={() => setActiveModal('location')}
          className="hidden xl:flex items-center gap-2 group flex-shrink-0 text-left border border-transparent hover:border-border-default rounded-lg px-2 py-1 transition-all"
        >
          <MapPin size={22} className="text-brand-primary" />
          <div className="flex flex-col">
            <span className="text-[10px] leading-tight text-text-muted font-bold uppercase">Deliver to</span>
            <span className="text-small font-bold text-text-primary group-hover:text-brand-primary transition-colors flex items-center gap-0.5">
              {location.city} {location.pincode} <ChevronDown size={12} />
            </span>
          </div>
        </button>

        {/* Search Bar (45%) */}
        <div className="hidden md:flex flex-1 max-w-[50%] relative">
          <form 
            onSubmit={handleSearch}
            className="w-full h-11 flex items-center bg-surface-secondary border border-border-default rounded-lg overflow-hidden focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-light transition-all shadow-sm group"
          >
            <div className="h-full border-r border-border-default px-4 flex items-center gap-2 cursor-pointer hover:bg-surface-tertiary transition-colors">
              <span className="text-small font-bold text-text-primary whitespace-nowrap">{selectedCategory}</span>
              <ChevronDown size={14} className="text-text-muted" />
            </div>
            <input 
              type="text"
              placeholder="Search for premium products..."
              className="flex-1 bg-transparent px-4 py-2 text-small text-text-primary placeholder:text-text-muted focus:outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button type="submit" className="h-full px-6 bg-brand-primary text-white hover:bg-brand-hover transition-colors flex items-center gap-2 font-bold">
              <Search size={18} />
            </button>
          </form>

          {/* Autocomplete Suggestions */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-border-default rounded-pro shadow-premium overflow-hidden z-[110]"
              >
                <div className="p-2">
                  <p className="px-4 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest bg-surface-secondary rounded-lg mb-2">Suggestions</p>
                  {suggestions.map((p) => (
                    <button
                      key={p._id || p.id}
                      onClick={() => {
                        setSearchQuery(p.name);
                        setShowSuggestions(false);
                        navigate(`/product/${p._id || p.id}`);
                      }}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-secondary transition-colors text-left rounded-lg group"
                    >
                      <div className="w-10 h-10 rounded-md bg-surface-tertiary overflow-hidden flex-shrink-0">
                        <img src={p.images?.[0]} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-small font-bold text-text-primary group-hover:text-brand-primary transition-colors line-clamp-1">{p.name}</span>
                        <span className="text-caption text-text-muted">{p.brand} · ₹{p.price.toLocaleString('en-IN')}</span>
                      </div>
                    </button>
                  ))}
                  <div className="mt-2 border-t border-border-default pt-2">
                     <button 
                       onClick={() => handleSearch()}
                       className="w-full py-2 text-caption font-bold text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-colors flex items-center justify-center gap-2"
                     >
                       See all results for "{searchQuery}"
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click shadow for suggestions */}
          {showSuggestions && (
            <div 
              className="fixed inset-0 z-[100]" 
              onClick={() => setShowSuggestions(false)}
            />
          )}
        </div>

        {/* Utility Icons */}
        <div className="flex items-center gap-4 md:gap-6 ml-auto">
          {/* Seller Link */}
          <Link 
            to={(isAuthenticated && (user?.role === 'seller' || user?.isSeller)) ? "/seller/dashboard" : "/seller/onboarding"} 
            className="hidden xl:block text-small font-bold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap"
          >
            Sell on ecom.me
          </Link>

          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="hidden xl:block text-small font-bold text-text-primary hover:text-brand-primary transition-colors whitespace-nowrap">
              Admin Panel
            </Link>
          )}

          {/* Mobile Search Icon */}
          <button className="md:hidden p-1 text-text-primary" onClick={() => navigate('/search')}>
            <Search size={24} />
          </button>

          {/* Account */}
          <div className="relative group cursor-pointer flex-shrink-0">
            <div 
              onClick={() => !isAuthenticated && setActiveModal('login')}
              className="flex items-center gap-2 border border-transparent hover:border-border-default rounded-lg px-2 py-1 transition-all"
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] leading-tight text-text-muted font-bold uppercase">Hello, {user?.name?.split(' ')[0] || 'Sign In'}</span>
                <span className="text-small font-bold text-text-primary flex items-center gap-0.5">
                  Account <ChevronDown size={12} className="text-text-muted transition-transform group-hover:rotate-180" />
                </span>
              </div>
              <User size={24} className="text-text-primary lg:hidden" />
            </div>
            
            {/* Account Dropdown */}
            {isAuthenticated && (
              <div className="absolute top-full right-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all bg-white z-[100]">
                <div className="bg-white border border-border-default rounded-pro shadow-premium p-2 min-w-[220px]">
                  <div className="px-4 py-3 mb-2 bg-surface-secondary rounded-lg">
                    <p className="text-caption font-bold text-text-muted uppercase">Signed in as</p>
                    <p className="text-small font-bold text-text-primary truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-2 text-small hover:bg-surface-secondary rounded-lg transition-colors font-medium">My Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-small hover:bg-surface-secondary rounded-lg transition-colors font-medium">Orders & Returns</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-small hover:bg-surface-secondary rounded-lg transition-colors font-medium">Wishlist</Link>
                  <div className="border-t border-border-default my-2" />
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-small text-danger hover:bg-danger/5 rounded-lg transition-colors font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative group flex items-center gap-2 border border-transparent hover:border-border-default rounded-lg px-2 py-1 transition-all">
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
            <div className="hidden lg:flex flex-col">
              <span className="text-[10px] leading-tight text-text-muted font-bold uppercase">Bag</span>
              <span className="text-small font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                Items
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Row 2: Category Navigation (44px) */}
      <div className="hidden md:block h-[44px] bg-white border-b border-border-default px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button className="flex items-center gap-2 text-small font-bold text-text-primary hover:text-brand-primary transition-colors group">
              <LayoutGrid size={18} className="text-brand-primary" /> 
              <span>Explore Categories</span>
            </button>
            <div className="h-5 w-[1px] bg-border-default" />
            
            {categories.slice(1).map((cat) => (
              <Link 
                key={cat} 
                to={`/products?category=${cat}`}
                className="text-small text-text-secondary font-bold hover:text-brand-primary transition-colors uppercase tracking-tight"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Location & Trending (36px) */}
      <div className="h-[40px] md:h-[36px] bg-surface-secondary border-b-2 border-brand-primary/5 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between overflow-hidden">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <MapPin size={14} className="text-brand-primary md:hidden" />
            <span 
              onClick={() => setActiveModal('location')}
              className="text-caption font-medium text-text-muted underline-offset-4 decoration-brand-primary/30 decoration-dotted underline cursor-pointer"
            >
              {location.city} {location.pincode}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6 overflow-x-auto no-scrollbar py-1">
            <span className="flex items-center gap-1.5 text-caption font-black text-brand-primary italic">
              <TrendingUp size={14} /> NOW TRENDING
            </span>
            {trendingSearches.map((term) => (
              <button 
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  navigate(`/products?q=${encodeURIComponent(term)}`);
                }}
                className="text-caption font-bold text-text-secondary hover:text-brand-primary transition-all whitespace-nowrap flex items-center gap-1"
              >
                #{term}
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
      <LocationModal />
    </nav>
  );
};

export default Navbar;
