import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  User as UserIcon, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../context/stores';
import { API_BASE, authHeaders } from '../utils/api';

const DashboardCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="panel p-6 flex items-center gap-5 hover:border-brand-primary/30 transition-all group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1">{title}</p>
      <p className="text-h3 font-display font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

const Profile = () => {
  const { isAuthenticated, user, updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    zip: '',
    isDefault: false
  });
  const [addingAddress, setAddingAddress] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/dashboard-stats`, {
        headers: authHeaders()
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(profileForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      updateUser(data);
      toast.success('Neural signature updated');
      setProfileForm((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const updatedAddresses = [...(user.savedAddresses || []), newAddress];
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ savedAddresses: updatedAddresses }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add address');
      updateUser(data);
      toast.success('New navigation node added');
      setNewAddress({ street: '', city: '', zip: '', isDefault: false });
      setAddingAddress(false);
      fetchStats();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAddress = async (index) => {
    const updatedAddresses = user.savedAddresses.filter((_, i) => i !== index);
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ savedAddresses: updatedAddresses }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete address');
      updateUser(data);
      toast.success('Navigation node purged');
      fetchStats();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary pb-20">
      {/* Hero Header */}
      <section className="bg-white border-b border-border-default pt-12 pb-8">
        <div className="site-shell">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-3xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border-2 border-brand-primary/20 shadow-xl shadow-brand-primary/5">
                <UserIcon size={40} />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-text-primary">{user?.name}</h1>
                <p className="text-small text-text-muted mt-1 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-brand-primary" />
                   Verified Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <button 
                 onClick={logout}
                 className="h-10 px-5 rounded-xl border border-border-default text-xs font-bold text-text-muted hover:bg-surface-secondary hover:text-error transition-all"
               >
                 Disconnect Session
               </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 mt-12 overflow-x-auto no-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: ShoppingBag },
              { id: 'addresses', label: 'Address Book', icon: MapPin },
              { id: 'settings', label: 'Account Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-small font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-brand-primary' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="site-shell mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-12">
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <DashboardCard 
                    title="Total Orders" 
                    value={stats?.totalOrders || 0} 
                    icon={ShoppingBag} 
                    colorClass="bg-brand-primary/10 text-brand-primary"
                  />
                  <DashboardCard 
                    title="Total Spent" 
                    value={`₹${(stats?.totalSpent || 0).toLocaleString()}`} 
                    icon={CreditCard} 
                    colorClass="bg-purple-50 text-purple-600"
                  />
                  <DashboardCard 
                    title="Saved Nodes" 
                    value={stats?.addressCount || 0} 
                    icon={MapPin} 
                    colorClass="bg-blue-50 text-blue-600"
                  />
                  <DashboardCard 
                    title="Wishlist" 
                    value={stats?.wishlistCount || 0} 
                    icon={Heart} 
                    colorClass="bg-pink-50 text-pink-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="panel p-8">
                    <h3 className="text-h4 font-display font-bold text-text-primary mb-2">Recent Activity</h3>
                    <p className="text-small text-text-muted mb-6">Your latest interactions with the neural shop.</p>
                    <div className="space-y-4">
                      <Link to="/orders" className="flex items-center justify-between p-4 bg-surface-secondary/50 rounded-2xl border border-transparent hover:border-brand-primary/20 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-sm">
                            <ShoppingBag size={18} />
                          </div>
                          <div>
                            <p className="text-caption font-bold text-text-primary">Track Latest Orders</p>
                            <p className="text-[11px] text-text-muted">Check delivery status & history</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-text-muted group-hover:text-brand-primary transition-colors" />
                      </Link>
                      <Link to="/wishlist" className="flex items-center justify-between p-4 bg-surface-secondary/50 rounded-2xl border border-transparent hover:border-brand-primary/20 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-pink-500 shadow-sm">
                            <Heart size={18} />
                          </div>
                          <div>
                            <p className="text-caption font-bold text-text-primary">View Wishlist</p>
                            <p className="text-[11px] text-text-muted">Manage your saved collectibles</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-text-muted group-hover:text-brand-primary transition-colors" />
                      </Link>
                    </div>
                  </div>

                  <div className="panel p-8 flex flex-col items-center justify-center text-center bg-brand-primary/5 border-brand-primary/10">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-lg shadow-brand-primary/10 mb-5">
                       <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-h4 font-display font-bold text-text-primary mb-2">Account in Sync</h3>
                    <p className="text-small text-text-secondary max-w-xs mx-auto leading-relaxed">
                      Your identity and preferences are securely encrypted within our neural marketplace.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-h3 font-display font-bold text-text-primary">Saved Nodes</h3>
                      <p className="text-small text-text-muted mt-1">Manage your delivery destinations for faster sync.</p>
                    </div>
                    <button 
                      onClick={() => setAddingAddress(true)}
                      className="h-10 px-5 rounded-xl bg-brand-primary text-xs font-bold text-white hover:bg-brand-hover transition-all flex items-center gap-2"
                    >
                      <Plus size={16} /> Add New Node
                    </button>
                 </div>

                 {addingAddress && (
                   <div className="panel p-8 mb-8 bg-brand-primary/5 border-brand-primary/20">
                      <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 block">Street Address</label>
                            <input 
                              required
                              className="w-full h-11 rounded-xl border border-border-default px-4 text-sm"
                              value={newAddress.street}
                              onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                              placeholder="e.g. 123 Neural Alley"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 block">City / Station</label>
                            <input 
                              required
                              className="w-full h-11 rounded-xl border border-border-default px-4 text-sm"
                              value={newAddress.city}
                              onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                              placeholder="e.g. Neo Tokyo"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 block">Zip / Vector ID</label>
                            <input 
                              required
                              className="w-full h-11 rounded-xl border border-border-default px-4 text-sm"
                              value={newAddress.zip}
                              onChange={e => setNewAddress({...newAddress, zip: e.target.value})}
                              placeholder="e.g. 400001"
                            />
                         </div>
                         <div className="md:col-span-2 flex items-center gap-4 mt-2">
                           <button type="submit" className="bg-brand-primary text-white px-8 py-2.5 rounded-xl font-bold text-xs">Register Node</button>
                           <button type="button" onClick={() => setAddingAddress(false)} className="text-text-muted font-bold text-xs">Cancel</button>
                         </div>
                      </form>
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(user.savedAddresses || []).map((addr, idx) => (
                      <div key={idx} className="panel p-6 flex justify-between items-start group hover:border-brand-primary/30 transition-all">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-surface-secondary flex items-center justify-center text-text-muted mt-1">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <p className="text-small font-bold text-text-primary">{addr.street}</p>
                            <p className="text-caption text-text-muted mt-0.5">{addr.city}, {addr.zip}</p>
                            {addr.isDefault && (
                              <span className="inline-block mt-2 px-2 py-0.5 bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase rounded">Default</span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteAddress(idx)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-error/10 hover:text-error transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {(user.savedAddresses || []).length === 0 && !addingAddress && (
                      <div className="col-span-2 py-12 text-center border-2 border-dashed border-border-default rounded-3xl">
                        <p className="text-text-muted font-medium">No navigation nodes stored. Add one to optimize your sync.</p>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <h3 className="text-h3 font-display font-bold text-text-primary mb-1">Account Parameters</h3>
                <p className="text-small text-text-muted mb-10">Modify your neural signature and access keys.</p>

                <div className="panel p-8">
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 block">Display Name</label>
                      <input
                        className="w-full h-12 rounded-xl border border-border-default bg-white px-4 text-sm focus:outline-none focus:border-brand-primary transition-all"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 block">Neural Signal (Email)</label>
                      <input
                        type="email"
                        className="w-full h-12 rounded-xl border border-border-default bg-white px-4 text-sm focus:outline-none focus:border-brand-primary transition-all"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-2 block">New Access Key (Optional)</label>
                      <input
                        type="password"
                        className="w-full h-12 rounded-xl border border-border-default bg-white px-4 text-sm focus:outline-none focus:border-brand-primary transition-all"
                        value={profileForm.password}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••••••"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="h-12 w-full md:w-auto rounded-xl bg-brand-primary px-10 text-xs font-bold text-white hover:bg-brand-hover transition-all disabled:opacity-70 shadow-lg shadow-brand-primary/20"
                    >
                      {savingProfile ? 'Updating Signature...' : 'Sync Profile'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
