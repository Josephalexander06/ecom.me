import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  Search
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const AdminDashboard = () => {
  const { products, orders } = useStore();
  const [activeTab, setActiveTab] = useState('system'); // 'system' | 'sellers'
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated Seller Data for the Demo
  const [sellers, setSellers] = useState([
    { id: 'sel1', name: 'Quantum Electronics', email: 'quantum@example.com', status: 'Pending', date: '2026-03-15' },
    { id: 'sel2', name: 'Horizon Threads', email: 'horizon@example.com', status: 'Approved', date: '2026-03-12' },
    { id: 'sel3', name: 'Neo Kitchen', email: 'neo@example.com', status: 'Pending', date: '2026-03-16' },
    { id: 'sel4', name: 'Aether Audio', email: 'aether@example.com', status: 'Rejected', date: '2026-03-10' },
  ]);

  const handleSellerAction = (id, newStatus) => {
    setSellers(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    // In a real app, this would trigger a fetch to /api/admin/sellers/status
  };

  const stats = useMemo(() => [
    { label: 'Platform Revenue', value: '$84,200', icon: DollarSign, color: 'text-success' },
    { label: 'Active Sellers', value: '124', icon: Users, color: 'text-brand-primary' },
    { label: 'Live Products', value: products.length, icon: ShoppingBag, color: 'text-warning' },
    { label: 'Security Level', value: 'High', icon: Shield, color: 'text-violet-500' },
  ], [products]);

  return (
    <div className="bg-surface-secondary min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-h2 font-display text-text-primary">Admin Core</h1>
            <p className="text-text-secondary">Governance and Marketplace Oversight</p>
          </div>
          <div className="flex bg-white rounded-pill p-1 border border-border-default">
            <button 
              onClick={() => setActiveTab('system')}
              className={`px-6 py-2 rounded-pill text-small font-bold transition-all ${activeTab === 'system' ? 'bg-brand-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              System Metrics
            </button>
            <button 
              onClick={() => setActiveTab('sellers')}
              className={`px-6 py-2 rounded-pill text-small font-bold transition-all ${activeTab === 'sellers' ? 'bg-brand-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Marketplace Sellers
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'system' ? (
            <motion.div 
              key="system"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                  <div key={stat.label} className="bg-white p-6 rounded-pro border border-border-default">
                    <stat.icon className={`${stat.color} mb-4`} size={24} />
                    <p className="text-caption font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                    <p className="text-h2 font-display text-text-primary">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-border-default rounded-pro overflow-hidden">
                <div className="p-6 border-b border-border-default">
                  <h3 className="text-body font-bold text-text-primary">Global Transaction Stream</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-secondary">
                      <tr>
                        <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Order ID</th>
                        <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Status</th>
                        <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                      {orders.map(order => (
                        <tr key={order._id} className="hover:bg-surface-secondary transition-colors">
                          <td className="px-6 py-4 text-small font-mono text-text-primary">#{order._id.slice(-8).toUpperCase()}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-brand-light text-brand-primary text-[10px] font-bold rounded-full">TRANSIT</span>
                          </td>
                          <td className="px-6 py-4 text-small font-bold text-text-primary text-right">${order.totalAmount?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="sellers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by seller name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-default rounded-lg focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="bg-white border border-border-default rounded-pro overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-surface-secondary border-b border-border-default">
                    <tr>
                      <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Seller Name</th>
                      <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Applied Date</th>
                      <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Status</th>
                      <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {sellers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((seller) => (
                      <tr key={seller.id} className="hover:bg-surface-secondary transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-small font-bold text-text-primary">{seller.name}</p>
                          <p className="text-caption text-text-muted">{seller.email}</p>
                        </td>
                        <td className="px-6 py-4 text-small text-text-secondary">{seller.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            seller.status === 'Approved' ? 'bg-success-light text-success' :
                            seller.status === 'Rejected' ? 'bg-danger-light text-danger' :
                            'bg-warning-light text-warning'
                          }`}>
                            {seller.status === 'Pending' && <Clock size={12} />}
                            {seller.status === 'Approved' && <CheckCircle2 size={12} />}
                            {seller.status === 'Rejected' && <XCircle size={12} />}
                            {seller.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             {seller.status === 'Pending' && (
                               <>
                                 <button 
                                   onClick={() => handleSellerAction(seller.id, 'Approved')}
                                   className="p-2 text-success hover:bg-success-light rounded-lg transition-colors"
                                 >
                                   <CheckCircle2 size={20} />
                                 </button>
                                 <button 
                                   onClick={() => handleSellerAction(seller.id, 'Rejected')}
                                   className="p-2 text-danger hover:bg-danger-light rounded-lg transition-colors"
                                 >
                                   <XCircle size={20} />
                                 </button>
                               </>
                             )}
                             <button className="p-2 text-text-muted hover:text-brand-primary rounded-lg transition-colors">
                               <ExternalLink size={18} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
