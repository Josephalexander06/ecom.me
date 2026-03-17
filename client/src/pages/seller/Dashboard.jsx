import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  ChevronRight, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  Zap,
  Settings,
  Plus,
  Layers
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import SellerLayout from '../../components/seller/SellerLayout';

const data = [
  { name: '01:00', sales: 4000, traffic: 2400 },
  { name: '04:00', sales: 3000, traffic: 1398 },
  { name: '08:00', sales: 2000, traffic: 9800 },
  { name: '12:00', sales: 2780, traffic: 3908 },
  { name: '16:00', sales: 1890, traffic: 4800 },
  { name: '20:00', sales: 2390, traffic: 3800 },
  { name: '23:59', sales: 3490, traffic: 4300 },
];

const inventoryData = [
  { name: 'Neural Links', value: 85, color: '#10ced1' },
  { name: 'Bio-Drives', value: 32, color: '#f59e0b' },
  { name: 'Haptic Suits', value: 12, color: '#ef4444' },
  { name: 'Retinal V1', value: 64, color: '#8b5cf6' },
];

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-bg-elevated p-6 rounded-3xl border border-border-main shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-bg-surface border border-border-main text-${color}`}>
        <Icon size={20} />
      </div>
      <span className="flex items-center gap-1 text-accent-success text-xs font-bold font-mono">
        <TrendingUp size={12} /> {change}
      </span>
    </div>
    <div className="space-y-1">
      <h3 className="text-text-dim font-mono text-[10px] uppercase tracking-widest font-bold">{title}</h3>
      <p className="text-2xl font-black text-text-main font-display tracking-tight">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <SellerLayout>
      <div className="space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display italic font-bold text-text-main">Neural Node Overview.</h1>
            <p className="text-text-muted text-sm mt-1 font-body">Real-time performance metrics synchronized with the Aether network.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-bg-secondary rounded-full border border-border-main flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-text-main uppercase tracking-widest">Network Live</span>
             </div>
             <button className="bg-accent-primary text-white p-3 rounded-2xl shadow-lg hover:rotate-90 transition-transform">
                <Settings size={20} />
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Node Revenue" value="$42,890.00" change="+12.5%" icon={DollarSign} color="accent-primary" />
          <StatCard title="Active Pings" value="1,284" change="+8.2%" icon={Users} color="accent-secondary" />
          <StatCard title="Inventory Load" value="456" change="-2.4%" icon={Package} color="accent-warning" />
          <StatCard title="Avg. Response" value="0.04ms" change="+0.1%" icon={Clock} color="accent-success" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Chart */}
           <div className="lg:col-span-2 bg-bg-elevated p-8 rounded-[2.5rem] border border-border-main shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-text-main font-bold flex items-center gap-2">
                     <Zap size={18} className="text-accent-primary" />
                     Revenue Velocity
                   </h3>
                   <p className="text-text-dim text-xs font-body italic mt-1">SDR Revenue vs Traffic Volume</p>
                </div>
                <select className="bg-bg-surface border border-border-main rounded-xl px-4 py-2 text-xs font-mono font-bold text-text-main outline-none">
                   <option>Last 24 Hours</option>
                   <option>Last 7 Days</option>
                </select>
             </div>
             
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10ced1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10ced1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6b7280', fontSize: 10, fontWeight: 'bold'}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#6b7280', fontSize: 10, fontWeight: 'bold'}}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderColor: '#e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '10px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                      }} 
                    />
                    <Area type="monotone" dataKey="sales" stroke="#10ced1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
           </div>

           {/* Health Summary */}
           <div className="bg-bg-elevated p-8 rounded-[2.5rem] border border-border-main shadow-sm">
              <h3 className="text-text-main font-bold mb-8 flex items-center gap-2">
                 <Layers size={18} className="text-accent-secondary" />
                 Inventory Health
              </h3>
              
              <div className="space-y-6">
                {inventoryData.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-widest">
                       <span className="text-text-main">{item.name}</span>
                       <span className={item.value < 20 ? 'text-accent-error' : 'text-text-dim'}>{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden border border-border-main shadow-inner">
                       <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.value}%` }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: item.color }}
                       />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-5 rounded-2xl bg-bg-surface border border-border-main flex items-center gap-4 group cursor-pointer hover:border-accent-primary transition-all shadow-sm">
                 <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-black transition-all">
                    <AlertCircle size={20} />
                 </div>
                 <div className="flex-1">
                    <h4 className="text-[10px] font-bold text-text-main uppercase tracking-widest">Critical Alert</h4>
                    <p className="text-[9px] text-text-dim mt-0.5">3 units require immediate node verification.</p>
                 </div>
                 <ChevronRight size={14} className="text-text-dim group-hover:translate-x-1 transition-transform" />
              </div>
           </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-bg-elevated to-bg-surface p-8 rounded-[2.5rem] border border-border-main flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-accent-primary shadow-xl border border-border-main">
                 <Plus size={32} />
              </div>
              <div>
                 <h3 className="text-xl font-display font-bold text-text-main italic">Expansion Protocol.</h3>
                 <p className="text-text-muted text-sm font-body">Initialize a new product listing into the Aether marketplace network.</p>
              </div>
           </div>
           <button className="whitespace-nowrap px-8 py-4 bg-accent-primary text-white rounded-2xl font-mono text-[10px] uppercase tracking-[0.2em] font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
              Initialize Listing Uplink
           </button>
        </div>
      </div>
    </SellerLayout>
  );
};

export default Dashboard;
