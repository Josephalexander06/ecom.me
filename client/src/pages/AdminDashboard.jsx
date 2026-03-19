import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock3, Megaphone, Package, Search, Settings2, Shield, ShoppingBag, Trash2, TrendingUp, Users, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import AdminLayout from '../components/admin/AdminLayout';
import { API_BASE, authHeaders } from '../utils/api';
import { defaultSiteConfig, fetchSiteConfig, updateSiteConfig } from '../utils/siteConfig';

const sectionByPath = {
  '/admin/dashboard': 'overview',
  '/admin/sellers': 'sellers',
  '/admin/users': 'users',
  '/admin/orders': 'orders',
  '/admin/products': 'products',
  '/admin/analytics': 'analytics',
  '/admin/settings': 'controls'
};

const pathBySection = Object.entries(sectionByPath).reduce((acc, [path, section]) => {
  acc[section] = path;
  return acc;
}, {});

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);

  const activeSection = sectionByPath[location.pathname] || 'overview';

  const goSection = (section) => {
    const next = pathBySection[section] || '/admin/dashboard';
    if (next !== location.pathname) navigate(next);
  };

  const load = async () => {
    try {
      const [d, s, u, o, p, cfg] = await Promise.all([
        fetch(`${API_BASE}/admin/dashboard`, { headers: authHeaders() }),
        fetch(`${API_BASE}/admin/sellers`, { headers: authHeaders() }),
        fetch(`${API_BASE}/admin/users`, { headers: authHeaders() }),
        fetch(`${API_BASE}/admin/orders`, { headers: authHeaders() }),
        fetch(`${API_BASE}/products`, { headers: authHeaders() }),
        fetchSiteConfig()
      ]);
      const [dData, sData, uData, oData, pData] = await Promise.all([d.json(), s.json(), u.json(), o.json(), p.json()]);
      if (!d.ok) throw new Error(dData.message || 'Failed to load dashboard');
      if (!s.ok) throw new Error(sData.message || 'Failed to load sellers');
      if (!u.ok) throw new Error(uData.message || 'Failed to load users');
      if (!o.ok) throw new Error(oData.message || 'Failed to load orders');
      if (!p.ok) throw new Error(pData.message || 'Failed to load products');

      setDashboard(dData);
      setSellers(sData);
      setUsers(uData);
      setOrders(oData);
      setProducts(Array.isArray(pData?.products) ? pData.products : []);
      setSiteConfig(cfg);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => [
    { label: 'Total Users', value: dashboard?.totalUsers || 0, icon: Users },
    { label: 'Total Orders', value: dashboard?.totalOrders || 0, icon: ShoppingBag },
    { label: 'Revenue', value: `₹${Number(dashboard?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: Shield },
    { label: 'Pending Sellers', value: dashboard?.pendingSellerApprovals || 0, icon: Clock3 }
  ], [dashboard]);

  const handleSellerAction = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/admin/sellers/${id}/status`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update seller status');
      toast.success(`Seller ${status.toLowerCase()}`);
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleBlockUser = async (id, blocked) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${id}/block`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ blocked })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update user');
      toast.success(data.message || 'User updated');
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to remove product');
      toast.success('Product removed');
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const saveConfig = async (nextConfig) => {
    try {
      const saved = await updateSiteConfig(nextConfig);
      setSiteConfig(saved);
      toast.success('Website settings updated');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleFlag = (key) => {
    saveConfig({ ...siteConfig, [key]: !siteConfig[key] });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => goSection('overview')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeSection === 'overview' ? 'bg-brand-primary text-white' : 'bg-white border border-border-default'}`}>Overview</button>
          <button onClick={() => goSection('sellers')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeSection === 'sellers' ? 'bg-brand-primary text-white' : 'bg-white border border-border-default'}`}>Seller Approvals</button>
          <button onClick={() => goSection('users')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeSection === 'users' ? 'bg-brand-primary text-white' : 'bg-white border border-border-default'}`}>Users</button>
          <button onClick={() => goSection('orders')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeSection === 'orders' ? 'bg-brand-primary text-white' : 'bg-white border border-border-default'}`}>Orders</button>
          <button onClick={() => goSection('products')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeSection === 'products' ? 'bg-brand-primary text-white' : 'bg-white border border-border-default'}`}>Products</button>
          <button onClick={() => goSection('analytics')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeSection === 'analytics' ? 'bg-brand-primary text-white' : 'bg-white border border-border-default'}`}>Advanced Analytics</button>
          <button onClick={() => goSection('controls')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeSection === 'controls' ? 'bg-brand-primary text-white' : 'bg-white border border-border-default'}`}>Website Controls</button>
        </div>

        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-6 rounded-pro border border-border-default shadow-sm">
                <stat.icon className="text-brand-primary mb-4" size={22} />
                <p className="text-caption font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                <p className="text-h2 font-display text-text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'sellers' && (
          <div className="space-y-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-default rounded-lg" placeholder="Search sellers..." />
            </div>
            <div className="bg-white border border-border-default rounded-pro overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Seller</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Status</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {sellers
                    .filter((s) => `${s.name} ${s.email}`.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((seller) => (
                      <tr key={seller._id}>
                        <td className="px-6 py-4"><p className="text-small font-bold">{seller.name}</p><p className="text-caption text-text-muted">{seller.email}</p></td>
                        <td className="px-6 py-4">{seller.sellerStatus}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => handleSellerAction(seller._id, 'Approved')} className="p-2 text-success hover:bg-success-light rounded-lg"><CheckCircle2 size={18} /></button>
                            <button onClick={() => handleSellerAction(seller._id, 'Rejected')} className="p-2 text-danger hover:bg-danger-light rounded-lg"><XCircle size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <div className="bg-white border border-border-default rounded-pro overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-secondary">
                <tr>
                  <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">User</th>
                  <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Role</th>
                  <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-right">Block</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-6 py-4"><p className="text-small font-bold">{u.name}</p><p className="text-caption text-text-muted">{u.email}</p></td>
                    <td className="px-6 py-4 uppercase">{u.role || 'user'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => toggleBlockUser(u._id, !u.isBlocked)} className={`px-4 py-2 rounded-lg text-caption font-bold ${u.isBlocked ? 'bg-success-light text-success' : 'bg-danger-light text-danger'}`}>
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="bg-white border border-border-default rounded-pro overflow-hidden">
            <div className="p-6 border-b border-border-default"><h3 className="text-body font-bold">Order Monitoring</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Order</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Status</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 text-small font-mono">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4 uppercase">{order.status}</td>
                      <td className="px-6 py-4 text-right font-bold">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="space-y-8">
            {/* Conversion Funnel */}
            <div className="bg-white p-8 rounded-pro border border-border-default shadow-sm">
               <h3 className="text-h3 font-display mb-8">Conversion Funnel</h3>
               <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                 {[
                   { label: 'Product Views', value: products.reduce((sum, p) => sum + (p.views || 0), 0), color: 'bg-brand-primary' },
                   { label: 'Added to Cart', value: Math.round(products.reduce((sum, p) => sum + (p.views || 0), 0) * 0.15), color: 'bg-brand-hover' },
                   { label: 'Purchases', value: products.reduce((sum, p) => sum + (p.soldCount || 0), 0), color: 'bg-brand-dark' }
                 ].map((step, i, arr) => (
                   <div key={step.label} className="relative">
                     <div className="flex items-center gap-6">
                        <div className={`h-16 flex-1 ${step.color} rounded-lg flex items-center justify-between px-8 text-white shadow-lg`}>
                           <span className="font-bold uppercase tracking-widest">{step.label}</span>
                           <span className="text-h4 font-mono font-black">{step.value.toLocaleString()}</span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className="w-24 text-center">
                             <p className="text-caption font-black text-brand-primary italic">-{Math.round(100 - (arr[i+1].value / step.value * 100))}%</p>
                             <p className="text-[8px] text-text-muted uppercase font-bold">Dropoff</p>
                          </div>
                        )}
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Heat Ranking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-pro border border-border-default shadow-sm text-surface-primary">
                  <h3 className="text-body font-bold mb-6 flex items-center gap-2">
                     <TrendingUp size={18} className="text-brand-primary" /> Most Viewed Products
                  </h3>
                  <div className="space-y-4">
                     {products.sort((a,b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((p, i) => (
                       <div key={p._id} className="flex items-center gap-4 p-3 bg-surface-secondary rounded-xl border border-border-default/50">
                          <span className="text-h4 font-black text-text-muted italic w-6">#{i+1}</span>
                          <img src={p.images?.[0]} className="w-12 h-12 rounded bg-white object-contain border border-border-default" />
                          <div className="flex-1 min-w-0">
                             <p className="text-small font-bold text-text-primary truncate">{p.name}</p>
                             <p className="text-caption text-text-muted">{p.brand}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-small font-black text-brand-primary">{p.views || 0}</p>
                             <p className="text-[8px] text-text-muted font-bold uppercase">Views</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-white p-6 rounded-pro border border-border-default shadow-sm">
                  <h3 className="text-body font-bold mb-6 flex items-center gap-2">
                     <Package size={18} className="text-success" /> Best Selling Products
                  </h3>
                  <div className="space-y-4">
                     {products.sort((a,b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5).map((p, i) => (
                       <div key={p._id} className="flex items-center gap-4 p-3 bg-surface-secondary rounded-xl border border-border-default/50">
                          <span className="text-h4 font-black text-text-muted italic w-6">#{i+1}</span>
                          <img src={p.images?.[0]} className="w-12 h-12 rounded bg-white object-contain border border-border-default" />
                          <div className="flex-1 min-w-0">
                             <p className="text-small font-bold text-text-primary truncate">{p.name}</p>
                             <p className="text-caption text-text-muted">{p.brand}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-small font-black text-success">{p.soldCount || 0}</p>
                             <p className="text-[8px] text-text-muted font-bold uppercase">Units Sold</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeSection === 'controls' && (
          <div className="space-y-6">
            <div className="bg-white border border-border-default rounded-pro p-6">
              <h3 className="text-body font-bold text-text-primary mb-4 flex items-center gap-2">
                <Megaphone size={18} className="text-brand-primary" /> Global Announcement
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-small font-medium">
                  <input type="checkbox" checked={siteConfig.globalAnnouncementEnabled} onChange={() => toggleFlag('globalAnnouncementEnabled')} />
                  Enable announcement bar on Home
                </label>
                <input
                  value={siteConfig.globalAnnouncementText}
                  onChange={(e) => saveConfig({ ...siteConfig, globalAnnouncementText: e.target.value })}
                  className="w-full bg-surface-secondary border border-border-default rounded-lg px-4 py-2.5"
                  placeholder="Announcement text"
                />
              </div>
            </div>

            <div className="bg-white border border-border-default rounded-pro p-6">
              <h3 className="text-body font-bold text-text-primary mb-4 flex items-center gap-2">
                <Settings2 size={18} className="text-brand-primary" /> Home Section Toggles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-small">
                {Object.keys(defaultSiteConfig)
                  .filter((key) => key.startsWith('show'))
                  .map((key) => (
                    <label key={key} className="flex items-center gap-2">
                      <input type="checkbox" checked={siteConfig[key]} onChange={() => toggleFlag(key)} />
                      {key.replace('show', '').replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

