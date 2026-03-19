import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Menu, X, LogOut, Bell, CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: CheckCircle2, label: 'Sellers', path: '/admin/sellers' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Settings, label: 'Website Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-bg-deep flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-black/5 p-8">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-8 h-8 bg-black rounded-sm rotate-45" />
          <span className="font-display text-xl tracking-tighter">AETHER // ADMIN</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-mono text-[10px] uppercase tracking-widest ${
                  isActive ? 'bg-accent-primary text-black shadow-[0_10px_20px_rgba(16,206,209,0.2)]' : 'text-text-muted hover:bg-black/5'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button className="flex items-center gap-4 px-6 py-4 text-text-muted hover:text-red-500 transition-colors font-mono text-[10px] uppercase tracking-widest mt-auto">
          <LogOut size={18} />
          Terminal Exit
        </button>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md border-b border-black/5 z-[100] px-6 flex items-center justify-between">
        <button onClick={() => setIsSidebarOpen(true)} className="w-12 h-12 flex items-center justify-center text-text-main">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-sm rotate-45" />
          <span className="font-display text-lg tracking-tighter">AETHER</span>
        </div>
        <button className="w-12 h-12 flex items-center justify-center text-text-main relative">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-accent-primary rounded-full" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white z-[120] p-8 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-black rounded-sm rotate-45" />
                  <span className="font-display text-lg tracking-tighter text-text-main">ADMIN MENU</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 flex items-center justify-center text-text-muted">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-4 py-4 text-text-main font-display text-xl italic"
                    >
                      <Icon size={20} className="text-accent-primary" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button className="mt-auto py-6 border-t border-black/5 text-text-muted flex items-center gap-4 font-mono text-xs uppercase tracking-widest">
                <LogOut size={18} />
                Terminal Exit
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="flex-1 lg:p-12 pt-28 px-6 pb-24 overflow-y-auto no-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
