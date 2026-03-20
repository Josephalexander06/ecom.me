import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  AlertTriangle,
  Bell,
  Box,
  DollarSign,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SellerLayout from '../../components/seller/SellerLayout';
import { API_BASE, authHeaders } from '../../utils/api';

const sectionByPath = {
  '/seller/dashboard': 'overview',
  '/seller/orders': 'orders',
  '/seller/inventory': 'inventory',
  '/seller/analytics': 'analytics',
  '/seller/settings': 'alerts',
};

const statusFlow = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

const SellerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [bulkPatch, setBulkPatch] = useState({ stock: '', price: '', dealPrice: '' });
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const activeSection = sectionByPath[location.pathname] || 'overview';

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${API_BASE}/orders/seller`, { headers: authHeaders() }),
        fetch(`${API_BASE}/products/seller/my-products`, { headers: authHeaders() }),
      ]);
      const [ordersData, productsData] = await Promise.all([ordersRes.json(), productsRes.json()]);
      if (!ordersRes.ok) throw new Error(ordersData.message || 'Failed to load seller orders');
      if (!productsRes.ok) throw new Error(productsData.message || 'Failed to load seller products');
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
      setLastSync(new Date());
    } catch (error) {
      toast.error(error.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const activeOrders = orders.filter((o) => ['pending', 'confirmed', 'packed', 'shipped'].includes((o.status || '').toLowerCase())).length;
    const lowStock = products.filter((p) => Number(p.stock || 0) <= 5).length;
    const outOfStock = products.filter((p) => Number(p.stock || 0) <= 0).length;
    const dealsCount = products.filter((p) => Boolean(p.isDeal)).length;
    return {
      totalRevenue,
      activeOrders,
      productCount: products.length,
      lowStock,
      outOfStock,
      dealsCount,
    };
  }, [orders, products]);

  const chartData = useMemo(() => {
    const byDate = {};
    orders.forEach((order) => {
      const key = new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      byDate[key] = byDate[key] || { name: key, sales: 0, orders: 0 };
      byDate[key].sales += Number(order.totalAmount || 0);
      byDate[key].orders += 1;
    });
    return Object.values(byDate).slice(-10);
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return orders
      .filter((order) => {
        const id = String(order._id || '').toLowerCase();
        const status = String(order.status || '').toLowerCase();
        return id.includes(q) || status.includes(q);
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, searchQuery]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products.filter((p) => `${p.name || ''} ${p.brand || ''} ${p.category || ''}`.toLowerCase().includes(q));
  }, [products, searchQuery]);

  const orderSla = useMemo(() => {
    const now = Date.now();
    const lanes = [
      { key: 'pending', label: 'Pending', targetHours: 1 },
      { key: 'confirmed', label: 'Confirmed', targetHours: 4 },
      { key: 'packed', label: 'Packed', targetHours: 8 },
      { key: 'shipped', label: 'Shipped', targetHours: 24 },
    ];

    return lanes.map((lane) => {
      const laneOrders = orders.filter((o) => String(o.status || '').toLowerCase() === lane.key);
      const overdue = laneOrders.filter((o) => {
        if (!o.createdAt) return false;
        const ageHours = (now - new Date(o.createdAt).getTime()) / (1000 * 60 * 60);
        return ageHours > lane.targetHours;
      }).length;

      return {
        ...lane,
        total: laneOrders.length,
        overdue,
      };
    });
  }, [orders]);

  const inventoryRisk = useMemo(() => {
    const lowStock = products.filter((p) => Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 5).length;
    const out = products.filter((p) => Number(p.stock || 0) <= 0).length;
    const highRisk = products.filter((p) => Number(p.stock || 0) <= 2).length;
    const score = Math.min(100, lowStock * 8 + out * 15 + highRisk * 10);
    return { lowStock, out, highRisk, score };
  }, [products]);

  const topProducts = useMemo(
    () => [...products].sort((a, b) => Number(b.soldCount || 0) - Number(a.soldCount || 0)).slice(0, 6),
    [products]
  );

  const nextStatusAction = (status) => {
    const normalized = (status || '').toLowerCase();
    const idx = statusFlow.indexOf(normalized);
    if (idx >= 0 && idx < statusFlow.length - 1) return statusFlow[idx + 1];
    return null;
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update order');
      toast.success('Order status updated');
      load(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const applyBulkUpdate = async () => {
    if (!selectedProductIds.length) {
      toast.error('Select at least one product');
      return;
    }

    const patch = {};
    if (bulkPatch.stock !== '') patch.stock = Number(bulkPatch.stock);
    if (bulkPatch.price !== '') patch.price = Number(bulkPatch.price);
    if (bulkPatch.dealPrice !== '') {
      patch.isDeal = true;
      patch.dealPrice = Number(bulkPatch.dealPrice);
    }

    if (!Object.keys(patch).length) {
      toast.error('Set at least one field for bulk update');
      return;
    }

    try {
      await Promise.all(
        selectedProductIds.map((id) =>
          fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: authHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(patch),
          })
        )
      );
      toast.success('Bulk product update applied');
      setSelectedProductIds([]);
      setBulkPatch({ stock: '', price: '', dealPrice: '' });
      load(true);
    } catch {
      toast.error('Bulk update failed');
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <section className="panel p-5 md:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-brand-primary text-white border-0">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-white/70">Seller Ops</p>
              <h1 className="mt-2 text-2xl md:text-3xl font-display font-bold tracking-tight">Seller Control Center</h1>
              <p className="mt-2 text-sm text-white/80 max-w-2xl">Run fulfillment, inventory, growth, and pricing from one enterprise-style command panel.</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button className="h-10 w-10 rounded-xl border border-white/20 bg-white/10 grid place-items-center text-white" aria-label="Notifications">
                <Bell size={18} />
              </button>
              <button
                className="h-10 rounded-xl px-4 border border-white/20 bg-white/10 text-sm font-semibold inline-flex items-center gap-2 hover:bg-white/20"
                onClick={() => load()}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button className="h-10 w-10 rounded-xl border border-white/20 bg-white/10 grid place-items-center text-white" onClick={() => navigate('/seller/settings')}>
                <Settings size={18} />
              </button>
              <Link to="/seller/add-product" className="h-10 rounded-xl bg-white px-4 text-slate-950 text-sm font-semibold inline-flex items-center gap-2 hover:bg-slate-100">
                <Plus size={16} />
                Add Product
              </Link>
            </div>
          </div>
          <div className="mt-4 text-xs text-white/70">Last sync: {lastSync ? lastSync.toLocaleString() : 'Loading...'}</div>
        </section>

        <section className="panel p-3 md:p-4">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              ['overview', 'Overview'],
              ['orders', 'Orders'],
              ['inventory', 'Inventory'],
              ['analytics', 'Analytics'],
              ['alerts', 'Alerts'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => navigate(key === 'overview' ? '/seller/dashboard' : key === 'alerts' ? '/seller/settings' : `/seller/${key}`)}
                className={`h-9 rounded-lg px-3 text-sm font-semibold ${
                  activeSection === key
                    ? 'bg-brand-primary text-white'
                    : 'bg-white border border-border-default text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {activeSection !== 'overview' && (
          <section className="panel p-4 md:p-5">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-border-default bg-white text-sm"
                placeholder={`Search ${activeSection}`}
              />
            </div>
          </section>
        )}

        {activeSection === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 md:gap-5">
              <div className="panel p-5 xl:col-span-2"><DollarSign className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Revenue</p><p className="text-2xl font-display font-bold">₹{summary.totalRevenue.toLocaleString('en-IN')}</p></div>
              <div className="panel p-5"><Package className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Active Orders</p><p className="text-2xl font-display font-bold">{summary.activeOrders}</p></div>
              <div className="panel p-5"><Box className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Products</p><p className="text-2xl font-display font-bold">{summary.productCount}</p></div>
              <div className="panel p-5"><TrendingUp className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Deals Live</p><p className="text-2xl font-display font-bold">{summary.dealsCount}</p></div>
              <div className="panel p-5"><AlertTriangle className="text-warning mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Low Stock</p><p className="text-2xl font-display font-bold">{summary.lowStock}</p></div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch">
              <div className="panel p-5 xl:col-span-2">
                <h3 className="text-base font-semibold mb-4">Order SLA board</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {orderSla.map((lane) => (
                    <div key={lane.key} className="rounded-xl border border-border-default bg-white p-3">
                      <p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">{lane.label}</p>
                      <p className="mt-1 text-xl font-display font-bold text-text-primary">{lane.total}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-text-muted">Target: {lane.targetHours}h</span>
                        <span className={lane.overdue > 0 ? 'text-danger font-semibold' : 'text-success font-semibold'}>
                          Overdue: {lane.overdue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel p-5">
                <h3 className="text-base font-semibold mb-4 inline-flex items-center gap-2">
                  <Shield size={16} className="text-brand-primary" />
                  Inventory risk engine
                </h3>
                <p className={`text-3xl font-display font-bold ${inventoryRisk.score >= 60 ? 'text-danger' : inventoryRisk.score >= 35 ? 'text-warning' : 'text-success'}`}>
                  {inventoryRisk.score}
                </p>
                <div className="mt-3 h-2 rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className={`h-full ${inventoryRisk.score >= 60 ? 'bg-danger' : inventoryRisk.score >= 35 ? 'bg-warning' : 'bg-success'}`}
                    style={{ width: `${inventoryRisk.score}%` }}
                  />
                </div>
                <div className="mt-4 space-y-2 text-xs text-text-secondary">
                  <p className="flex items-center justify-between"><span>Low stock</span><strong>{inventoryRisk.lowStock}</strong></p>
                  <p className="flex items-center justify-between"><span>Out of stock</span><strong>{inventoryRisk.out}</strong></p>
                  <p className="flex items-center justify-between"><span>Critical (&lt;=2)</span><strong>{inventoryRisk.highRisk}</strong></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <div className="panel p-5">
                <h3 className="text-base font-semibold mb-4">Sales Trend</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="#1859ff" fill="#e8f0ff" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="panel p-5">
                <h3 className="text-base font-semibold mb-4">Top Performing Products</h3>
                <div className="space-y-2.5">
                  {topProducts.map((p, idx) => (
                    <div key={p._id || idx} className="rounded-xl border border-border-default bg-surface-secondary/40 p-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold line-clamp-1">{p.name || 'Untitled Product'}</p>
                        <p className="text-xs text-text-muted">{p.brand || 'Unbranded'} · {p.category || 'Uncategorized'}</p>
                      </div>
                      <span className="text-sm font-semibold text-brand-primary">{Number(p.soldCount || 0)} sold</span>
                    </div>
                  ))}
                  {topProducts.length === 0 && <p className="text-sm text-text-muted">No product performance data yet.</p>}
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'orders' && (
          <div className="panel overflow-hidden">
            <div className="p-4 md:p-5 border-b border-border-default flex items-center justify-between">
              <h3 className="text-base font-semibold">Order Management</h3>
              <span className="text-xs text-text-muted">{filteredOrders.length} orders</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="bg-surface-secondary/70 text-left">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Order</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Amount</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Status</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Items</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {filteredOrders.map((order) => {
                    const action = nextStatusAction(order.status);
                    return (
                      <tr key={order._id}>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-mono font-semibold">#{String(order._id || '').slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'N/A'}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm font-semibold">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3.5 text-sm uppercase text-text-secondary">{order.status || 'pending'}</td>
                        <td className="px-5 py-3.5 text-sm">{Array.isArray(order.items) ? order.items.length : 0}</td>
                        <td className="px-5 py-3.5 text-right">
                          {action ? (
                            <button onClick={() => updateOrderStatus(order._id, action)} className="h-8 rounded-lg px-3 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-hover">
                              Mark {action}
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-success">Completed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'inventory' && (
          <div className="space-y-5">
            <div className="panel p-4 md:p-5">
              <h3 className="text-base font-semibold mb-3">Bulk Inventory Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <label className="text-sm text-text-secondary">
                  Stock
                  <input type="number" min="0" value={bulkPatch.stock} onChange={(e) => setBulkPatch((prev) => ({ ...prev, stock: e.target.value }))} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" />
                </label>
                <label className="text-sm text-text-secondary">
                  Price (₹)
                  <input type="number" min="0" value={bulkPatch.price} onChange={(e) => setBulkPatch((prev) => ({ ...prev, price: e.target.value }))} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" />
                </label>
                <label className="text-sm text-text-secondary">
                  Deal Price (₹)
                  <input type="number" min="0" value={bulkPatch.dealPrice} onChange={(e) => setBulkPatch((prev) => ({ ...prev, dealPrice: e.target.value }))} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" />
                </label>
                <div className="flex items-end">
                  <button onClick={applyBulkUpdate} className="w-full h-10 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-hover">
                    Apply to {selectedProductIds.length || 0} selected
                  </button>
                </div>
              </div>
            </div>

            <div className="panel overflow-hidden">
            <div className="p-4 md:p-5 border-b border-border-default flex items-center justify-between">
              <h3 className="text-base font-semibold">Inventory Control</h3>
              <span className="text-xs text-text-muted">{filteredProducts.length} products</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead className="bg-surface-secondary/70 text-left">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Select</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Product</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Category</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Stock</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Deal</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Price</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {filteredProducts.map((p) => {
                    const stock = Number(p.stock || 0);
                    return (
                      <tr key={p._id}>
                        <td className="px-5 py-3.5">
                          <input type="checkbox" checked={selectedProductIds.includes(p._id)} onChange={() => toggleSelectProduct(p._id)} />
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold line-clamp-1">{p.name || 'Untitled Product'}</p>
                          <p className="text-xs text-text-muted">{p.brand || 'Unbranded'}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-text-secondary">{p.category || 'Uncategorized'}</td>
                        <td className="px-5 py-3.5 text-sm">
                          <span className={`rounded-md px-2 py-1 text-xs font-semibold ${stock <= 0 ? 'bg-rose-50 text-danger' : stock <= 5 ? 'bg-amber-50 text-warning' : 'bg-emerald-50 text-success'}`}>
                            {stock}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm">{p.isDeal ? 'Active' : 'No deal'}</td>
                        <td className="px-5 py-3.5 text-right text-sm font-semibold">₹{Number(p.price || 0).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3.5 text-right">
                          <Link to={`/seller/products/${p._id}/edit`} className="h-8 rounded-lg px-3 border border-border-default text-xs font-semibold inline-flex items-center hover:border-brand-primary">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#1859ff" fill="#e8f0ff" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="panel p-5">
              <h3 className="text-base font-semibold mb-4">Order Count</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#1859ff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeSection === 'alerts' && (
          <div className="panel p-5">
            <h3 className="text-base font-semibold mb-4">Low Stock Alerts</h3>
            <div className="space-y-2.5">
              {products.filter((p) => Number(p.stock || 0) <= 5).length === 0 && (
                <p className="text-sm text-text-muted">No low stock products.</p>
              )}
              {products
                .filter((p) => Number(p.stock || 0) <= 5)
                .map((p) => (
                  <div key={p._id} className="rounded-xl border border-border-default bg-surface-secondary/60 p-3">
                    <p className="text-sm font-semibold text-text-primary line-clamp-1">{p.name}</p>
                    <p className="text-xs text-danger">Only {p.stock} left</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
