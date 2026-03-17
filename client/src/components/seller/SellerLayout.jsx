import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Settings, 
  Menu, 
  X, 
  LogOut, 
  Bell,
  Cpu,
  Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SellerLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Hub Overview', path: '/seller/dashboard' },
    { icon: PlusCircle, label: 'List New Product', path: '/seller/add-product' },
    { icon: Package, label: 'Inventory Stacks', path: '/seller/inventory' },
    { icon: ShoppingBag, label: 'Neural Orders', path: '/seller/orders' },
    { icon: TrendingUp, label: 'Revenue Streams', path: '/seller/analytics' },
    { icon: Settings, label: 'Nexus Settings', path: '/seller/settings' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-bg-surface border-r border-border-main p-8 shadow-sm z-20">
        <div className="flex items-center gap-3 mb-16">
          <div className="p-2 bg-accent-primary rounded-lg text-white">
            <Cpu size={20} />
          </div>
          <span className="font-display text-xl tracking-tighter text-text-main uppercase italic">Seller // Hub</span>
        </div>

        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-mono text-[10px] uppercase tracking-[0.2em] group ${
                  isActive 
                    ? 'bg-accent-primary text-white shadow-xl' 
                    : 'text-text-muted hover:bg-bg-secondary hover:text-accent-primary'
                }`}
              >
                <Icon size={18} className={`${isActive ? 'text-black' : 'text-accent-primary group-hover:scale-110 transition-transform'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
           <div className="p-6 rounded-2xl bg-accent-secondary/5 border border-accent-secondary/20">
              <div className="flex items-center gap-2 mb-2 text-accent-secondary">
                 <Zap size={14} fill="currentColor" />
                 <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Pro Status</span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">Your neural listings are performing 15% better this week.</p>
           </div>
           
           <button className="w-full flex items-center gap-4 px-6 py-4 text-text-muted hover:text-red-500 transition-colors font-mono text-[10px] uppercase tracking-widest border border-white/5 rounded-xl">
             <LogOut size={18} />
             Disconnect Session
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-24 bg-bg-primary/80 backdrop-blur-xl border-b border-border-main flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-12 h-12 flex items-center justify-center text-text-main hover:bg-bg-secondary rounded-xl">
            <Menu size={24} />
          </button>
          
          <div className="hidden lg:flex flex-col">
             <span className="text-[10px] font-mono text-text-dim uppercase tracking-[0.3em]">Marketplace // Node 0x7F</span>
             <h2 className="text-text-main text-lg font-display italic font-bold">Welcome back, Neural Core Labs.</h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="w-12 h-12 flex items-center justify-center text-text-muted hover:text-accent-primary transition-colors relative group">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-accent-warning rounded-full border-2 border-bg-secondary group-hover:scale-125 transition-transform" />
            </button>
            
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary p-[1px]">
               <div className="w-full h-full rounded-[11px] bg-bg-primary flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-accent-primary">NC</span>
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto no-scrollbar relative">
          {/* Subtle noise/grid background for the seller dashboard */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          
          <div className="relative z-10">
            {children}
          </div>
        </main>
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[300px] bg-bg-secondary z-[120] p-8 flex flex-col lg:hidden border-r border-accent-primary/20"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <Cpu className="text-accent-primary" size={24} />
                  <span className="font-display text-xl tracking-tighter text-white italic uppercase">Seller Menu</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-white rounded-lg bg-white/5">
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
                      className="flex items-center gap-4 py-4 px-6 rounded-xl text-text-main font-display text-lg italic hover:bg-accent-primary/10 hover:text-accent-primary transition-all border border-transparent hover:border-accent-primary/20"
                    >
                      <Icon size={20} className="text-accent-primary" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <button className="mt-auto py-6 border-t border-white/5 text-text-muted flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors">
                <LogOut size={18} />
                Disconnect Session
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerLayout;
