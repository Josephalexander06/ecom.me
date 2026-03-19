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
  X,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { useAuthStore, useUIStore, useCartStore } from '../../context/stores';
import { useStore } from '../../context/StoreContext';
import LocationModal from './LocationModal';

const categories = ['All', 'Electronics', 'Mobiles', 'Fashion', 'Home', 'Books', 'Beauty', 'Groceries'];
const trendingSearches = ['iPhone 15', 'Running Shoes', 'Noise Cancelling', 'Premium Watches', 'Kitchen Smart'];

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, location, hasSetLocation, detectLocation } = useAuthStore();
  const { setActiveModal, isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const { items } = useCartStore();
  const { products } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!hasSetLocation) {
      detectLocation().catch(() => {});
    }
  }, [hasSetLocation, detectLocation]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    return (products || [])
      .filter(
        (p) =>
          p &&
          ((p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand?.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedCategory === 'All' || p.category === selectedCategory))
      )
      .slice(0, 6);
  }, [searchQuery, products, selectedCategory]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setShowSuggestions(false);
    navigate(`/products?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
  };

  const effectiveRole = user?.role || (user?.isAdmin ? 'admin' : user?.isSeller ? 'seller' : 'user');
  const sellerLink = isAuthenticated && (effectiveRole === 'seller' || effectiveRole === 'admin')
    ? '/seller/dashboard'
    : '/seller/onboarding';

  const accountLinks = [
    { label: 'My Profile', to: '/profile' },
    { label: 'Orders', to: '/orders' },
    { label: 'Wishlist', to: '/wishlist' },
  ];

  return (
    <nav className="sticky top-0 z-[70] border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="site-shell">
        <div className="hidden lg:flex h-10 items-center justify-between text-[12px] text-text-muted border-b border-border-default/70">
          <button
            onClick={() => setActiveModal('location')}
            className="inline-flex items-center gap-1.5 hover:text-brand-primary transition-colors"
          >
            <MapPin size={14} />
            <span>
              Delivering to {location.city} {location.pincode}
            </span>
          </button>
          <div className="flex items-center gap-5">
            <Link to={sellerLink} className="font-semibold hover:text-brand-primary transition-colors">Sell on ecom.me</Link>
            {effectiveRole === 'admin' && (
              <Link to="/admin/dashboard" className="font-semibold hover:text-brand-primary transition-colors">
                Admin Dashboard
              </Link>
            )}
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-primary">
              <TrendingUp size={14} />
              Fast delivery in major cities
            </span>
          </div>
        </div>

        <div className="h-[74px] flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => toggleMobileMenu()}
            className="lg:hidden p-2 rounded-xl border border-border-default bg-white text-text-primary"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="shrink-0">
            <h1 className="font-display font-extrabold text-[1.45rem] tracking-[-0.04em] text-text-primary">
              ecom<span className="text-brand-primary">.me</span>
            </h1>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 min-w-0 relative">
            <div className="w-full h-12 rounded-2xl border border-border-default bg-white shadow-sm flex items-center overflow-hidden focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10 transition-all">
              <button
                type="button"
                className="h-full px-3 lg:px-4 border-r border-border-default text-[12px] font-semibold text-text-secondary inline-flex items-center gap-1"
              >
                {selectedCategory}
                <ChevronDown size={14} />
              </button>
              <input
                type="text"
                placeholder="Search products, brands and categories"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="flex-1 bg-transparent px-4 text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <button
                type="submit"
                className="h-full px-4 lg:px-6 bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-colors inline-flex items-center gap-2"
              >
                <Search size={17} />
                <span className="hidden lg:inline">Search</span>
              </button>
            </div>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 panel overflow-hidden z-[120]"
                >
                  <div className="p-2">
                    <p className="px-3 py-2 text-[10px] uppercase tracking-[0.16em] font-bold text-text-muted">
                      Quick Suggestions
                    </p>
                    {suggestions.map((p) => (
                      <button
                        key={p._id || p.id}
                        onClick={() => {
                          setSearchQuery(p.name || '');
                          setShowSuggestions(false);
                          navigate(`/product/${p._id || p.id}`);
                        }}
                        className="w-full rounded-xl px-3 py-2.5 text-left hover:bg-surface-secondary transition-colors flex items-center gap-3"
                      >
                        <div className="h-10 w-10 rounded-lg border border-border-default bg-surface-secondary overflow-hidden">
                          <img src={p.images?.[0]} alt="" className="h-full w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text-primary">{p.name}</p>
                          <p className="truncate text-xs text-text-muted">{p.brand} · ₹{p.price?.toLocaleString('en-IN')}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => handleSearch()}
                      className="w-full mt-1 rounded-xl px-3 py-2.5 text-xs font-semibold text-brand-primary hover:bg-brand-primary/5 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      View all results
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {showSuggestions && (
              <button
                type="button"
                className="fixed inset-0 z-[110]"
                aria-label="Close suggestions"
                onClick={() => setShowSuggestions(false)}
              />
            )}
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setActiveModal('login');
                    return;
                  }
                  setShowAccountMenu((prev) => !prev);
                }}
                className="group flex items-center gap-2 rounded-xl border border-transparent px-3 py-2 hover:border-border-default hover:bg-white transition-all"
              >
                <User size={18} className="text-text-secondary group-hover:text-brand-primary" />
                <div className="text-left leading-tight">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-text-muted font-bold">Account</p>
                  <p className="text-xs font-semibold text-text-primary">
                    {isAuthenticated ? user?.name?.split(' ')[0] : 'Sign in'}
                  </p>
                </div>
                {isAuthenticated && (
                  <ChevronDown size={14} className={`text-text-muted transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
                )}
              </button>

              <AnimatePresence>
                {showAccountMenu && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-56 panel overflow-hidden z-[130]"
                  >
                    <div className="p-2">
                      <div className="px-3 py-2.5 rounded-xl bg-surface-secondary mb-1">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-text-muted font-bold">Signed in as</p>
                        <p className="text-xs font-semibold text-text-primary truncate">{user?.email}</p>
                      </div>
                      {accountLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setShowAccountMenu(false)}
                          className="block rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          setShowAccountMenu(false);
                          logout();
                        }}
                        className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-danger hover:bg-rose-50 inline-flex items-center gap-2"
                      >
                        <LogOut size={15} />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/cart"
              className="relative rounded-xl border border-border-default bg-white px-3 py-2.5 hover:border-brand-primary/40 transition-all"
            >
              <ShoppingBag size={20} className="text-text-primary" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 rounded-full bg-brand-primary text-white text-[10px] font-bold grid place-items-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="hidden md:flex h-12 items-center justify-between border-t border-border-default/60">
          <div className="flex items-center gap-2 lg:gap-6 overflow-x-auto no-scrollbar">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <LayoutGrid size={16} className="text-brand-primary" />
              Explore
            </button>
            {categories.slice(1).map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="text-sm font-medium text-text-secondary hover:text-brand-primary whitespace-nowrap transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
          <div className="hidden xl:flex items-center gap-4 text-xs text-text-muted">
            {trendingSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  navigate(`/products?q=${encodeURIComponent(term)}`);
                }}
                className="hover:text-brand-primary transition-colors"
              >
                #{term}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => toggleMobileMenu(false)}
              className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm z-[80] lg:hidden"
              aria-label="Close menu"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed left-0 top-0 bottom-0 z-[90] w-[300px] bg-white border-r border-border-default shadow-2xl lg:hidden"
            >
              <div className="p-5 border-b border-border-default flex items-center justify-between">
                <h2 className="font-display text-lg font-bold">Menu</h2>
                <button onClick={() => toggleMobileMenu(false)} className="p-1 rounded-lg border border-border-default">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-5 overflow-y-auto h-[calc(100%-72px)]">
                {!isAuthenticated ? (
                  <button
                    onClick={() => {
                      toggleMobileMenu(false);
                      setActiveModal('login');
                    }}
                    className="w-full rounded-xl bg-brand-primary text-white py-3 font-semibold"
                  >
                    Sign In / Register
                  </button>
                ) : (
                  <div className="rounded-xl border border-border-default p-3">
                    <p className="text-xs text-text-muted">Signed in as</p>
                    <p className="text-sm font-semibold text-text-primary truncate">{user?.email}</p>
                    <div className="mt-3 space-y-1">
                      {accountLinks.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => toggleMobileMenu(false)}
                          className="block rounded-lg px-2.5 py-2 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <button onClick={logout} className="mt-2 text-sm font-semibold text-danger">
                      Logout
                    </button>
                  </div>
                )}

                <div>
                  <p className="text-[11px] font-bold tracking-[0.16em] text-text-muted uppercase mb-2">Categories</p>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/products?category=${cat}`}
                        onClick={() => toggleMobileMenu(false)}
                        className="block rounded-lg px-2.5 py-2 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Link onClick={() => toggleMobileMenu(false)} to={sellerLink} className="block rounded-lg px-2.5 py-2 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary">
                    Sell on ecom.me
                  </Link>
                  {effectiveRole === 'admin' && (
                    <Link onClick={() => toggleMobileMenu(false)} to="/admin/dashboard" className="block rounded-lg px-2.5 py-2 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text-primary">
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {showAccountMenu && (
        <button
          type="button"
          className="fixed inset-0 z-[120]"
          aria-label="Close account menu"
          onClick={() => setShowAccountMenu(false)}
        />
      )}

      <LocationModal />
    </nav>
  );
};

export default Navbar;
