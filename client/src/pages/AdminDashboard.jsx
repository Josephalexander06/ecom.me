import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, Zap, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { io } from 'socket.io-client';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Neural Link Connection
    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
    
    socket.on('neural-activity', (data) => {
      setActivities((prev) => [data, ...prev].slice(0, 10));
    });

    // Initial Analytics Sync
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/products/analytics`);
        const data = await response.json();
        
        // Map backend stats to UI format
        const summary = data.summary || {};
        const formattedStats = [
            { label: 'Neural Inventory', value: summary.totalProducts || 0, change: '+5.2%', isUp: true, icon: ShoppingBag },
            { label: 'Stock Reservoir', value: summary.totalStock || 0, change: '+2.1%', isUp: true, icon: Zap },
            { label: 'Sync Output', value: summary.totalSold || 0, change: '+12.5%', isUp: true, icon: Users },
            { label: 'Avg Unit Credit', value: `$${summary.averagePrice || 0}`, change: '+0.8%', isUp: true, icon: TrendingUp },
        ];
        
        setStats(formattedStats);
        setChartData([
            { name: 'Mon', value: 400 },
            { name: 'Tue', value: 300 },
            { name: 'Wed', value: 600 },
            { name: 'Thu', value: 800 },
            { name: 'Fri', value: 500 },
            { name: 'Sat', value: 900 },
            { name: 'Sun', value: 1000 },
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error('Analytics Sync Failed:', err);
      }
    };

    fetchAnalytics();

    return () => socket.disconnect();
  }, []);
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        <header>
          <h1 className="font-display text-4xl text-text-main italic mb-2">System Overview.</h1>
          <p className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">Real-time neural metrics ingestion active.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl border border-black/5 bg-white/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-accent-primary">
                    <Icon size={20} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-mono font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                    {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  </div>
                </div>
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-1">{stat.label}</span>
                <span className="text-3xl font-mono text-text-main font-bold">{stat.value}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Chart Section */}
        <div className="glass p-8 md:p-12 rounded-[3rem] border border-black/5 bg-white/50">
          <div className="flex items-center justify-between mb-12">
            <h3 className="font-display text-2xl text-text-main italic">Neural Sync Growth</h3>
            <select className="bg-black/5 border-none rounded-xl px-4 py-2 font-mono text-[10px] uppercase tracking-widest outline-none text-text-main">
                <option>Phase 7 (Current)</option>
                <option>Phase 6</option>
            </select>
          </div>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10ced1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10ced1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#666', fontFamily: 'monospace' }}
                    dy={10}
                />
                <YAxis hide={true} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.8)', 
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontFamily: 'monospace'
                    }} 
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10ced1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="glass p-8 rounded-[2.5rem] border border-black/5 bg-white/30 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-display text-2xl text-text-main italic">Live Neural Feed</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">Uplink Active</span>
                    </div>
                </div>
                <div className="space-y-4 max-h-[360px] overflow-y-auto no-scrollbar pr-2">
                    <AnimatePresence>
                        {activities.length === 0 ? (
                            <div className="py-10 text-center text-text-muted font-mono text-[10px] uppercase tracking-widest">Waiting for neural packets...</div>
                        ) : (
                            activities.map((activity) => (
                                <motion.div 
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-black/5 border border-black/5 group hover:bg-white transition-all shadow-sm"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-black transition-colors">
                                        <Activity size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-main truncate">{activity.message}</p>
                                        <span className="text-[10px] font-mono text-text-muted">{new Date(activity.timestamp).toLocaleTimeString()} // ID: 0x{activity.id.toString(16).slice(-8)}</span>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                </div>
            </div>
            
            <div className="glass p-8 rounded-[2.5rem] border border-black/5">
                <h3 className="font-display text-2xl text-text-main italic mb-8">System Health</h3>
                <div className="space-y-8">
                    {['Latency', 'Uptime', 'Security', 'Throughput'].map((metric) => (
                        <div key={metric} className="space-y-2">
                            <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-text-muted">
                                <span>{metric}</span>
                                <span>Optimal</span>
                            </div>
                            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: '92%' }}
                                    className="h-full bg-accent-primary"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
