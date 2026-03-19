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
  '/seller/settings': 'alerts'
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
        fetch(`${API_BASE}/products/seller/my-products`, { headers: authHeaders() })
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
      lowStock
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
        body: JSON.stringify({ status })
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-h2 font-display text-text-primary">Seller Dashboard</h1>
            <p className="text-text-secondary">Operate orders, inventory, and growth from one control hub.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-border-default rounded-full text-text-secondary"><Bell size={20} /></button>
            <button className="p-2.5 bg-white border border-border-default rounded-full text-text-secondary" onClick={() => navigate('/seller/settings')}><Settings size={20} /></button>
            <Link to="/seller/add-product" className="bg-brand-primary text-white px-6 py-2.5 rounded-pill font-bold flex items-center gap-2">
              <Plus size={20} /> Add Product
            </Link>
          </div>
        </div>

        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-white border border-border-default rounded-pro p-6 shadow-sm"><DollarSign className="text-brand-primary mb-3" size={22} /><p className="text-caption text-text-muted font-bold uppercase">Revenue</p><p className="text-h2 font-display">₹{summary.totalRevenue.toLocaleString('en-IN')}</p></div>
            <div className="bg-white border border-border-default rounded-pro p-6 shadow-sm"><Package className="text-brand-primary mb-3" size={22} /><p className="text-caption text-text-muted font-bold uppercase">Active Orders</p><p className="text-h2 font-display">{summary.activeOrders}</p></div>
            <div className="bg-white border border-border-default rounded-pro p-6 shadow-sm"><Box className="text-brand-primary mb-3" size={22} /><p className="text-caption text-text-muted font-bold uppercase">Products</p><p className="text-h2 font-display">{summary.productCount}</p></div>
            <div className="bg-white border border-border-default rounded-pro p-6 shadow-sm"><TrendingUp className="text-brand-primary mb-3" size={22} /><p className="text-caption text-text-muted font-bold uppercase">Low Stock</p><p className="text-h2 font-display">{summary.lowStock}</p></div>
          </div>
        )}

        {activeSection === 'orders' && (
          <div className="bg-white border border-border-default rounded-pro overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border-default"><h3 className="text-body font-bold">Order Management</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Order</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Amount</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Status</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {orders.map((order) => {
                    const action = nextStatusAction(order.status);
                    return (
                      <tr key={order._id}>
                        <td className="px-6 py-4"><p className="text-small font-mono font-bold">#{order._id.slice(-8).toUpperCase()}</p><p className="text-caption text-text-muted">{new Date(order.createdAt).toLocaleString('en-IN')}</p></td>
                        <td className="px-6 py-4 font-bold">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 uppercase">{order.status}</td>
                        <td className="px-6 py-4 text-right">
                          {action ? (
                            <button onClick={() => updateOrderStatus(order._id, action)} className="px-4 py-2 bg-brand-primary text-white text-caption font-bold rounded-md">Mark {action}</button>
                          ) : (
                            <span className="text-caption text-success font-bold">Completed</span>
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
          <div className="bg-white border border-border-default rounded-pro overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border-default"><h3 className="text-body font-bold">Inventory Control</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-secondary">
                  <tr>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Product</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-left">Stock</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="px-6 py-4"><p className="text-small font-bold">{p.name}</p><p className="text-caption text-text-muted">{p.category}</p></td>
                      <td className="px-6 py-4">{p.stock}</td>
                      <td className="px-6 py-4 text-right font-bold">₹{Number(p.price || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-border-default rounded-pro p-6 shadow-sm">
              <h3 className="text-body font-bold mb-4">Sales Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="#0066ff" fill="#e6f0ff" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white border border-border-default rounded-pro p-6 shadow-sm">
              <h3 className="text-body font-bold mb-4">Order Count</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#0066ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeSection === 'alerts' && (
          <div className="bg-white border border-border-default rounded-pro p-6 shadow-sm">
            <h3 className="text-body font-bold mb-4">Low Stock Alerts</h3>
            <div className="space-y-3">
              {products.filter((p) => Number(p.stock || 0) <= 5).length === 0 && (
                <p className="text-small text-text-muted">No low stock products.</p>
              )}
              {products
                .filter((p) => Number(p.stock || 0) <= 5)
                .map((p) => (
                  <div key={p._id} className="p-3 rounded-lg border border-border-default bg-surface-secondary">
                    <p className="text-small font-bold text-text-primary line-clamp-1">{p.name}</p>
                    <p className="text-caption text-danger">Only {p.stock} left</p>
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

