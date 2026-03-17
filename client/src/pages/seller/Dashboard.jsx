import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  DollarSign, 
  Package, 
  Users, 
  ArrowUpRight, 
  TrendingUp, 
  Plus,
  Settings,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Check,
  Truck,
  Box
} from 'lucide-react';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 12 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 15 },
  { name: 'Sat', sales: 2390, orders: 25 },
  { name: 'Sun', sales: 3490, orders: 30 },
];

const MetricCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white border border-border-default rounded-pro p-6 hover:shadow-sm transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="flex items-center gap-1 text-success text-caption font-bold">
        <ArrowUpRight size={14} /> {change}
      </div>
    </div>
    <div className="text-caption font-bold text-text-muted uppercase tracking-wider mb-1">{title}</div>
    <div className="text-h2 font-display text-text-primary">{value}</div>
  </div>
);

const Dashboard = () => {
  const [orders, setOrders] = useState([
    { id: '#ORD-2035-1', customer: 'Alex Johnson', amount: 299.00, status: 'Processing', date: 'Today, 10:42 AM' },
    { id: '#ORD-2035-2', customer: 'Sarah Miller', amount: 849.50, status: 'Processing', date: 'Today, 09:15 AM' },
    { id: '#ORD-2035-3', customer: 'David Chen', amount: 120.00, status: 'Shipped', date: 'Yesterday' },
    { id: '#ORD-2035-4', customer: 'Emma Wilson', amount: 45.00, status: 'Delivered', date: 'Oct 12' },
    { id: '#ORD-2035-5', customer: 'Michael Wong', amount: 1299.99, status: 'Shipped', date: 'Oct 11' }
  ]);
  
  const [products] = useState([
    { id: 1, name: 'Sony WH-1000XM5 Noise Cancelling Headphones', stock: 45, price: 348.00, status: 'Active' },
    { id: 2, name: 'Apple iPhone 15 Pro, 256GB, Natural Titanium', stock: 12, price: 1099.00, status: 'Active' },
    { id: 3, name: 'Logitech MX Master 3S Wireless Mouse', stock: 0, price: 99.00, status: 'Out of Stock' },
  ]);

  const updateOrderStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Processing': return 'bg-warning-light text-warning border-warning/20';
      case 'Shipped': return 'bg-brand-light/30 text-brand-primary border-brand-primary/20';
      case 'Delivered': return 'bg-success-light text-success border-success/20';
      default: return 'bg-surface-secondary text-text-muted border-border-default';
    }
  };

  return (
    <div className="bg-surface-secondary min-h-screen p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-h2 font-display text-text-primary">Seller Console</h1>
            <p className="text-text-secondary">Welcome back, Matrix Tech. Here's your store performance.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2.5 bg-white border border-border-default rounded-full text-text-secondary hover:text-brand-primary transition-colors">
               <Bell size={20} />
             </button>
             <button className="p-2.5 bg-white border border-border-default rounded-full text-text-secondary hover:text-brand-primary transition-colors">
               <Settings size={20} />
             </button>
             <Link 
               to="/seller/add-product"
               className="bg-brand-primary text-white px-6 py-2.5 rounded-pill font-bold shadow-sm hover:bg-brand-hover transition-colors flex items-center gap-2"
             >
               <Plus size={20} /> Add Product
             </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Revenue" 
            value="$18,420.50" 
            change="+12.5%" 
            icon={DollarSign} 
            color="bg-brand-primary" 
          />
          <MetricCard 
            title="Active Orders" 
            value="142" 
            change="+8.2%" 
            icon={Package} 
            color="bg-warning" 
          />
          <MetricCard 
            title="Customers" 
            value="892" 
            change="+5.1%" 
            icon={Users} 
            color="bg-violet-500" 
          />
          <MetricCard 
            title="Conv. Rate" 
            value="3.24%" 
            change="+1.2%" 
            icon={TrendingUp} 
            color="bg-success" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          
          {/* Recent Orders Tracker - Actionable */}
          <div className="bg-white border border-border-default rounded-pro overflow-hidden flex flex-col shadow-sm">
            <div className="p-6 border-b border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-secondary/50">
               <div className="flex items-center gap-3">
                 <Package className="text-brand-primary" size={24} />
                 <h3 className="text-body font-bold text-text-primary">Fulfillment Queue</h3>
               </div>
               <div className="flex items-center gap-2">
                 <div className="relative">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                   <input 
                     type="text" 
                     placeholder="Search orders..." 
                     className="pl-9 pr-4 py-2 bg-white border border-border-default rounded-md text-small focus:outline-none focus:border-brand-primary transition-colors"
                   />
                 </div>
                 <button className="p-2 border border-border-default bg-white rounded-md text-text-secondary hover:text-brand-primary transition-colors">
                   <Filter size={18} />
                 </button>
               </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-border-default">
                  <tr>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Order Info</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Amount</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Status</th>
                    <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default border-b border-border-default">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-small font-bold text-text-primary">{order.id}</div>
                        <div className="text-caption text-text-secondary mt-0.5">{order.customer} • {order.date}</div>
                      </td>
                      <td className="px-6 py-4 text-small font-bold text-text-primary font-mono">${order.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border uppercase tracking-wider flex items-center gap-1.5 w-fit ${getStatusStyle(order.status)}`}>
                            {order.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />}
                            {order.status === 'Shipped' && <Truck size={12} />}
                            {order.status === 'Delivered' && <Check size={12} />}
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {order.status === 'Processing' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Shipped')}
                            className="px-4 py-1.5 bg-brand-primary text-white text-caption font-bold rounded-md hover:bg-brand-hover transition-colors shadow-sm"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'Delivered')}
                            className="px-4 py-1.5 bg-success text-white text-caption font-bold rounded-md hover:bg-success/90 transition-colors shadow-sm"
                          >
                            Mark Delivered
                          </button>
                        )}
                        {order.status === 'Delivered' && (
                          <button className="p-2 text-text-muted hover:text-text-primary transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-surface-secondary/50 text-center">
              <button className="text-small font-bold text-brand-primary hover:underline">View All Orders</button>
            </div>
          </div>

          {/* Quick Inventory Widget */}
          <div className="bg-white border border-border-default rounded-pro flex flex-col shadow-sm">
            <div className="p-6 border-b border-border-default flex items-center justify-between bg-surface-secondary/50">
              <div className="flex items-center gap-3">
                <Box className="text-brand-primary" size={24} />
                <h3 className="text-body font-bold text-text-primary">Inventory Overview</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {products.map(product => (
                <div key={product.id} className="p-5 border-b border-border-default last:border-0 hover:bg-surface-secondary/30 transition-colors">
                  <div className="flex justify-between gap-4 mb-2">
                    <h4 className="text-small font-bold text-text-primary line-clamp-2 leading-tight">{product.name}</h4>
                    <span className="text-small font-mono font-bold text-text-primary block whitespace-nowrap">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                         product.stock > 10 ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                       }`}>
                         {product.stock} in stock
                       </span>
                    </div>
                    <button className="text-caption font-bold text-brand-primary hover:underline">Edit Listing</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border-default bg-surface-secondary/50 text-center mt-auto">
              <Link to="/seller/add-product" className="text-small font-bold text-brand-primary hover:underline flex items-center justify-center gap-2">
                <Plus size={16} /> Manage Complete Catalog
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
