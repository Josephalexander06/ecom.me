import React from 'react';
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
  Bell
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
  <div className="bg-white border border-border-default rounded-pro p-6 hover:shadow-premium transition-all">
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          <div className="bg-white border border-border-default rounded-pro p-8">
            <h3 className="text-body font-bold text-text-primary mb-8">Sales Velocity (Last 7 Days)</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066ff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0066ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#0066ff" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-border-default rounded-pro p-8">
            <h3 className="text-body font-bold text-text-primary mb-8">Order Distribution</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                  <Tooltip 
                    cursor={{fill: '#f7f7f8'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="orders" fill="#ff6b00" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity (Placeholder Table) */}
        <div className="bg-white border border-border-default rounded-pro overflow-hidden">
          <div className="p-6 border-b border-border-default flex items-center justify-between">
             <h3 className="text-body font-bold text-text-primary">Recent Orders</h3>
             <button className="text-small font-bold text-brand-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-secondary">
                <tr>
                  <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Order ID</th>
                  <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Customer</th>
                  <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Amount</th>
                  <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Status</th>
                  <th className="px-6 py-4 text-caption font-bold text-text-muted uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {[1,2,3,4,5].map(i => (
                  <tr key={i} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-6 py-4 text-small font-mono text-text-primary">#ORD-2035-{i}</td>
                    <td className="px-6 py-4 text-small text-text-primary">Alex Johnson</td>
                    <td className="px-6 py-4 text-small font-bold text-text-primary">$299.00</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-success-light text-success text-[10px] font-bold rounded-full border border-success/10 uppercase">Shipped</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-caption font-bold text-brand-primary hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
