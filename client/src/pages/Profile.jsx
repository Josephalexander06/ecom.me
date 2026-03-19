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
    password: ''
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
        body: JSON.stringify(form)
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
    <div className="bg-surface-secondary min-h-screen py-10">
      <div className="max-w-[900px] mx-auto px-4 md:px-8">
        <div className="bg-white rounded-pro border border-border-default p-6 md:p-8">
          <h1 className="text-h2 font-display text-text-primary mb-1">My Profile</h1>
          <p className="text-small text-text-muted mb-8">
            Role: <span className="font-bold text-text-primary uppercase">{user?.role || 'user'}</span>
            {' '}| Seller Status: <span className="font-bold text-text-primary">{user?.sellerStatus || 'None'}</span>
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-caption font-bold text-text-secondary">Name</label>
              <input
                className="w-full mt-1 bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-caption font-bold text-text-secondary">Email</label>
              <input
                type="email"
                className="w-full mt-1 bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="text-caption font-bold text-text-secondary">New Password (optional)</label>
              <input
                type="password"
                className="w-full mt-1 bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-brand-primary text-white px-8 py-3 rounded-pro font-bold hover:bg-brand-hover transition-colors disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

