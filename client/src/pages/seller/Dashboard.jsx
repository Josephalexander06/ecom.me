import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Bell, Box, DollarSign, Package, Plus, Settings, TrendingUp } from 'lucide-react';
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

const SellerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const activeSection = sectionByPath[location.pathname] || 'overview';

  const load = async () => {
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
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const activeOrders = orders.filter((o) => ['pending', 'packed', 'shipped'].includes((o.status || '').toLowerCase())).length;
    const lowStock = products.filter((p) => Number(p.stock || 0) <= 5).length;
    return {
      totalRevenue,
      activeOrders,
      productCount: products.length,
      lowStock,
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
    return Object.values(byDate).slice(-7);
  }, [orders]);

  const nextStatusAction = (status) => {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'pending') return 'confirmed';
    if (normalized === 'confirmed') return 'packed';
    if (normalized === 'packed') return 'shipped';
    if (normalized === 'shipped') return 'delivered';
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
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="panel p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Seller Dashboard</h1>
            <p className="text-sm text-text-secondary mt-1">Operate orders, inventory, and growth from one control hub.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 w-10 rounded-xl border border-border-default bg-white grid place-items-center text-text-secondary">
              <Bell size={18} />
            </button>
            <button className="h-10 w-10 rounded-xl border border-border-default bg-white grid place-items-center text-text-secondary" onClick={() => navigate('/seller/settings')}>
              <Settings size={18} />
            </button>
            <Link to="/seller/add-product" className="h-10 rounded-xl bg-brand-primary px-4 text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-hover">
              <Plus size={16} />
              Add Product
            </Link>
          </div>
        </div>

        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            <div className="panel p-5"><DollarSign className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Revenue</p><p className="text-2xl font-display font-bold">₹{summary.totalRevenue.toLocaleString('en-IN')}</p></div>
            <div className="panel p-5"><Package className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Active Orders</p><p className="text-2xl font-display font-bold">{summary.activeOrders}</p></div>
            <div className="panel p-5"><Box className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Products</p><p className="text-2xl font-display font-bold">{summary.productCount}</p></div>
            <div className="panel p-5"><TrendingUp className="text-brand-primary mb-3" size={20} /><p className="text-xs uppercase tracking-[0.12em] font-bold text-text-muted">Low Stock</p><p className="text-2xl font-display font-bold">{summary.lowStock}</p></div>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="panel overflow-hidden">
            <div className="p-4 md:p-5 border-b border-border-default"><h3 className="text-base font-semibold">Order Management</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-surface-secondary/70 text-left">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Order</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Amount</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Status</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {orders.map((order) => {
                    const action = nextStatusAction(order.status);
                    return (
                      <tr key={order._id}>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-mono font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm font-semibold">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3.5 text-sm uppercase text-text-secondary">{order.status}</td>
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
          <div className="panel overflow-hidden">
            <div className="p-4 md:p-5 border-b border-border-default"><h3 className="text-base font-semibold">Inventory Control</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-surface-secondary/70 text-left">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Product</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Stock</th>
                    <th className="px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-text-muted text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold">{p.name}</p>
                        <p className="text-xs text-text-muted">{p.category}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm">{p.stock}</td>
                      <td className="px-5 py-3.5 text-right text-sm font-semibold">₹{Number(p.price || 0).toLocaleString('en-IN')}</td>
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
