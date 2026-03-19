import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock3,
  Megaphone,
  Search,
  Settings2,
  ShoppingBag,
  Trash2,
  Users,
  XCircle,
  Shield,
} from 'lucide-react';
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
  '/admin/settings': 'controls',
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
        fetchSiteConfig(),
      ]);

      const [dData, sData, uData, oData, pData] = await Promise.all([d.json(), s.json(), u.json(), o.json(), p.json()]);

      if (!d.ok) throw new Error(dData.message || 'Failed to load dashboard');
      if (!s.ok) throw new Error(sData.message || 'Failed to load sellers');
      if (!u.ok) throw new Error(uData.message || 'Failed to load users');
      if (!o.ok) throw new Error(oData.message || 'Failed to load orders');
      if (!p.ok) throw new Error(pData.message || 'Failed to load products');

      setDashboard(dData);
      setSellers(Array.isArray(sData) ? sData : []);
      setUsers(Array.isArray(uData) ? uData : []);
      setOrders(Array.isArray(oData) ? oData : []);
      setProducts(Array.isArray(pData?.products) ? pData.products : []);
      setSiteConfig(cfg);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Users', value: dashboard?.totalUsers || 0, icon: Users },
      { label: 'Total Orders', value: dashboard?.totalOrders || 0, icon: ShoppingBag },
      { label: 'Revenue', value: `₹${Number(dashboard?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: Shield },
      { label: 'Pending Sellers', value: dashboard?.pendingSellerApprovals || 0, icon: Clock3 },
    ],
    [dashboard]
  );

  const ordersByStatus = useMemo(() => {
    const map = { pending: 0, confirmed: 0, packed: 0, shipped: 0, delivered: 0 };
    orders.forEach((o) => {
      const status = (o.status || 'pending').toLowerCase();
      map[status] = (map[status] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [orders]);

  const mostViewed = useMemo(
    () => [...products].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5),
    [products]
  );

  const bestSelling = useMemo(
    () => [...products].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0)).slice(0, 5),
    [products]
  );

  const handleSellerAction = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/admin/sellers/${id}/status`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status }),
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
        body: JSON.stringify({ blocked }),
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
        headers: authHeaders(),
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
        <div className="panel p-4 md:p-5">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              ['overview', 'Overview'],
              ['sellers', 'Sellers'],
              ['users', 'Users'],
              ['orders', 'Orders'],
              ['products', 'Products'],
              ['analytics', 'Analytics'],
              ['controls', 'Controls'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => goSection(key)}
                className={`h-9 rounded-lg px-4 text-sm font-semibold ${
                  activeSection === key
                    ? 'bg-brand-primary text-white'
                    : 'bg-white border border-border-default text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {stats.map((stat) => (
              <div key={stat.label} className="panel p-5">
                <stat.icon className="text-brand-primary mb-3" size={20} />
                <p className="text-xs uppercase tracking-[0.14em] font-bold text-text-muted">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-text-primary mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'sellers' && (
          <div className="panel overflow-hidden">
            <div className="p-4 md:p-5 border-b border-border-default flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <h3 className="text-base font-semibold">Seller approvals</h3>
              <div className="relative w-full md:w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-border-default bg-white text-sm"
                  placeholder="Search sellers"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-surface-secondary/70 text-left">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Seller</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Status</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {sellers
                    .filter((s) => `${s.name} ${s.email}`.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((seller) => (
                      <tr key={seller._id}>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold text-text-primary">{seller.name}</p>
                          <p className="text-xs text-text-muted">{seller.email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-text-secondary">{seller.sellerStatus}</td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex gap-2">
                            <button onClick={() => handleSellerAction(seller._id, 'Approved')} className="h-8 w-8 rounded-lg border border-emerald-200 bg-emerald-50 text-success grid place-items-center">
                              <CheckCircle2 size={16} />
                            </button>
                            <button onClick={() => handleSellerAction(seller._id, 'Rejected')} className="h-8 w-8 rounded-lg border border-rose-200 bg-rose-50 text-danger grid place-items-center">
                              <XCircle size={16} />
                            </button>
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
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-surface-secondary/70 text-left">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">User</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Role</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Block</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-text-primary">{u.name}</p>
                        <p className="text-xs text-text-muted">{u.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm uppercase text-text-secondary">{u.role || 'user'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => toggleBlockUser(u._id, !u.isBlocked)}
                          className={`h-8 rounded-lg px-3 text-xs font-semibold ${u.isBlocked ? 'bg-emerald-50 text-success border border-emerald-200' : 'bg-rose-50 text-danger border border-rose-200'}`}
                        >
                          {u.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="panel overflow-hidden">
            <div className="p-4 md:p-5 border-b border-border-default">
              <h3 className="text-base font-semibold">Order monitoring</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-surface-secondary/70 text-left">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Order</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Status</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-5 py-3.5 text-sm font-mono">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-3.5 text-sm uppercase text-text-secondary">{order.status}</td>
                      <td className="px-5 py-3.5 text-right text-sm font-semibold text-text-primary">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'products' && (
          <div className="panel overflow-hidden">
            <div className="p-4 md:p-5 border-b border-border-default flex items-center justify-between">
              <h3 className="text-base font-semibold">Product moderation</h3>
              <p className="text-xs text-text-muted">{products.length} products</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px]">
                <thead className="bg-surface-secondary/70 text-left">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Product</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Category</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Price</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-text-primary line-clamp-1">{p.name}</p>
                        <p className="text-xs text-text-muted">{p.brand}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-secondary">{p.category}</td>
                      <td className="px-5 py-3.5 text-right text-sm font-semibold">₹{Number(p.price || 0).toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button onClick={() => removeProduct(p._id)} className="h-8 w-8 rounded-lg border border-rose-200 bg-rose-50 text-danger grid place-items-center">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4">Order status distribution</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={ordersByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1859ff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4">Top viewed products</h3>
              <div className="space-y-2.5">
                {mostViewed.map((p, idx) => (
                  <div key={p._id || p.id || idx} className="rounded-xl border border-border-default bg-surface-secondary/40 p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold line-clamp-1">{p.name}</p>
                      <p className="text-xs text-text-muted">{p.brand}</p>
                    </div>
                    <span className="text-sm font-semibold text-brand-primary">{p.views || 0} views</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-5 xl:col-span-2">
              <h3 className="text-base font-semibold mb-4">Best selling products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {bestSelling.map((p, idx) => (
                  <div key={p._id || p.id || idx} className="rounded-xl border border-border-default bg-white p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Rank #{idx + 1}</p>
                    <p className="mt-1 text-sm font-semibold line-clamp-1">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.brand}</p>
                    <p className="mt-2 text-sm font-semibold text-success">{p.soldCount || 0} sold</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'controls' && (
          <div className="space-y-5">
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                <Megaphone size={16} className="text-brand-primary" />
                Global announcement
              </h3>
              <div className="space-y-3">
                <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
                  <input type="checkbox" checked={siteConfig.globalAnnouncementEnabled} onChange={() => toggleFlag('globalAnnouncementEnabled')} />
                  Enable announcement bar on home page
                </label>
                <input
                  value={siteConfig.globalAnnouncementText}
                  onChange={(e) => saveConfig({ ...siteConfig, globalAnnouncementText: e.target.value })}
                  className="w-full h-10 rounded-xl border border-border-default bg-white px-3 text-sm"
                  placeholder="Announcement text"
                />
              </div>
            </div>

            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                <Settings2 size={16} className="text-brand-primary" />
                Home section toggles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm">
                {Object.keys(defaultSiteConfig)
                  .filter((key) => key.startsWith('show'))
                  .map((key) => (
                    <label key={key} className="inline-flex items-center gap-2 text-text-secondary">
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
