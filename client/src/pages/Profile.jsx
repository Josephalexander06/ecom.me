import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../context/stores';
import { API_BASE, authHeaders } from '../utils/api';

const Profile = () => {
  const { isAuthenticated, user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
      updateUser(data);
      toast.success('Profile updated');
      setForm((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <section className="site-shell pt-6">
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">My Profile</h1>
      </section>

      <section className="site-shell mt-5 max-w-4xl">
        <div className="panel p-5 md:p-7">
          <p className="text-sm text-text-muted mb-7">
            Role: <span className="font-semibold text-text-primary uppercase">{user?.role || 'user'}</span>
            {' | '}
            Seller Status: <span className="font-semibold text-text-primary">{user?.sellerStatus || 'None'}</span>
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Name</label>
              <input
                className="w-full mt-1.5 h-11 rounded-xl border border-border-default bg-white px-4 text-sm focus:outline-none focus:border-brand-primary"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">Email</label>
              <input
                type="email"
                className="w-full mt-1.5 h-11 rounded-xl border border-border-default bg-white px-4 text-sm focus:outline-none focus:border-brand-primary"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-[0.12em] text-text-muted">New Password (optional)</label>
              <input
                type="password"
                className="w-full mt-1.5 h-11 rounded-xl border border-border-default bg-white px-4 text-sm focus:outline-none focus:border-brand-primary"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-xl bg-brand-primary px-6 text-sm font-semibold text-white hover:bg-brand-hover transition-colors disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Profile;
