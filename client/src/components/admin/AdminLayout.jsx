import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle2, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingBag, Users, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/stores';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
    { icon: CheckCircle2, label: 'Sellers', path: '/admin/sellers' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Site Controls', path: '/admin/controls/site' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-primary flex">
      <aside className="hidden lg:flex sticky top-0 h-screen overflow-y-auto w-72 shrink-0 border-r border-border-default bg-white/95 backdrop-blur-sm p-6 flex-col">
        <Link to="/admin/dashboard" className="inline-flex items-center gap-2.5 mb-8">
          <span className="h-8 w-8 rounded-lg bg-brand-primary text-white grid place-items-center text-sm font-bold">A</span>
          <span className="font-display text-lg font-bold tracking-tight">Admin Console</span>
        </Link>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path.startsWith('/admin/controls')
              ? location.pathname.startsWith('/admin/controls') || location.pathname === '/admin/settings'
              : location.pathname === item.path;
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

        <button
          onClick={handleLogout}
          className="mt-auto inline-flex items-center gap-2 rounded-xl border border-border-default px-3 py-2.5 text-sm font-semibold text-text-secondary hover:text-danger hover:border-danger/40"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-40 h-16 border-b border-border-default bg-white/90 backdrop-blur-sm px-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="h-9 w-9 rounded-lg border border-border-default grid place-items-center">
            <Menu size={18} />
          </button>
          <span className="font-display font-bold">Admin Console</span>
          <button onClick={handleLogout} className="h-9 px-3 rounded-lg border border-border-default text-sm font-semibold text-text-secondary">
            Logout
          </button>
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
                <span className="font-display font-bold">Admin Menu</span>
                <button onClick={() => setIsSidebarOpen(false)} className="h-8 w-8 rounded-lg border border-border-default grid place-items-center">
                  <X size={16} />
                </button>
              </div>

              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.path.startsWith('/admin/controls')
                    ? location.pathname.startsWith('/admin/controls') || location.pathname === '/admin/settings'
                    : location.pathname === item.path;
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

export default AdminLayout;
