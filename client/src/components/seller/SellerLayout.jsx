import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, Package, ShoppingBag, TrendingUp, Settings, Menu, X, LogOut, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/stores';

const SellerLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/seller/dashboard' },
    { icon: PlusCircle, label: 'Add Product', path: '/seller/add-product' },
    { icon: ShoppingBag, label: 'Orders', path: '/seller/orders' },
    { icon: Package, label: 'Inventory', path: '/seller/inventory' },
    { icon: TrendingUp, label: 'Analytics', path: '/seller/analytics' },
    { icon: Settings, label: 'Alerts', path: '/seller/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-primary flex">
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-border-default bg-white/90 backdrop-blur-sm p-6 flex-col">
        <Link to="/seller/dashboard" className="inline-flex items-center gap-2.5 mb-8">
          <span className="h-8 w-8 rounded-lg bg-brand-primary text-white grid place-items-center text-sm font-bold">S</span>
          <span className="font-display text-lg font-bold tracking-tight">Seller Hub</span>
        </Link>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-xl border border-border-default bg-surface-secondary/60 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] font-bold text-text-muted">Active Seller</p>
            <p className="text-sm font-semibold text-text-primary mt-1 truncate">{user?.name || 'Store Owner'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center gap-2 rounded-xl border border-border-default px-3 py-2.5 text-sm font-semibold text-text-secondary hover:text-danger hover:border-danger/40"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 h-16 border-b border-border-default bg-white/90 backdrop-blur-sm px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden h-9 w-9 rounded-lg border border-border-default grid place-items-center">
              <Menu size={18} />
            </button>
            <h2 className="text-sm md:text-base font-display font-bold tracking-tight">Seller Operations</h2>
          </div>
          <div className="inline-flex items-center gap-2.5">
            <button className="h-9 w-9 rounded-lg border border-border-default grid place-items-center text-text-secondary">
              <Bell size={16} />
            </button>
            <button onClick={handleLogout} className="hidden sm:inline-flex h-9 items-center rounded-lg border border-border-default px-3 text-sm font-semibold text-text-secondary">
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/35 z-50 lg:hidden"
              aria-label="Close menu"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed top-0 left-0 h-full w-[280px] border-r border-border-default bg-white z-[60] p-5 lg:hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-display font-bold">Seller Menu</span>
                <button onClick={() => setIsSidebarOpen(false)} className="h-8 w-8 rounded-lg border border-border-default grid place-items-center">
                  <X size={16} />
                </button>
              </div>
              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                        isActive
                          ? 'bg-brand-primary text-white'
                          : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerLayout;
