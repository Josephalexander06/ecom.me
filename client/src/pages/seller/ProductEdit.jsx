import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import SellerLayout from '../../components/seller/SellerLayout';
import { API_BASE, authHeaders } from '../../utils/api';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    isDeal: false,
    dealPrice: '',
    dealExpiresAt: '',
    image1: '',
    image2: '',
    image3: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE}/products/${id}`, { headers: authHeaders() });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to load product');
        setForm({
          name: data.name || '',
          brand: data.brand || '',
          category: data.category || '',
          description: data.description || '',
          price: String(data.price || ''),
          stock: String(data.stock || ''),
          isDeal: Boolean(data.isDeal),
          dealPrice: data.dealPrice ? String(data.dealPrice) : '',
          dealExpiresAt: data.dealExpiresAt ? new Date(data.dealExpiresAt).toISOString().slice(0, 16) : '',
          image1: data.images?.[0] || '',
          image2: data.images?.[1] || '',
          image3: data.images?.[2] || '',
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const images = useMemo(() => [form.image1, form.image2, form.image3].filter(Boolean), [form.image1, form.image2, form.image3]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        brand: form.brand,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        images,
        isDeal: Boolean(form.isDeal),
        dealPrice: form.isDeal ? Number(form.dealPrice || 0) : undefined,
        dealExpiresAt: form.isDeal && form.dealExpiresAt ? new Date(form.dealExpiresAt) : undefined,
      };
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update product');
      toast.success('Product updated');
      navigate('/seller/inventory');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="panel p-6">Loading product...</div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/seller/inventory" className="h-10 w-10 rounded-full border border-border-default bg-white grid place-items-center">
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold">Edit Product</h1>
            <p className="text-sm text-text-secondary">Update pricing, stock, deal settings and listing details.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="panel p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm text-text-secondary">Name<input name="name" value={form.name} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" required /></label>
          <label className="text-sm text-text-secondary">Brand<input name="brand" value={form.brand} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" required /></label>
          <label className="text-sm text-text-secondary">Category<input name="category" value={form.category} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" required /></label>
          <label className="text-sm text-text-secondary">Price<input name="price" type="number" min="1" value={form.price} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" required /></label>
          <label className="text-sm text-text-secondary">Stock<input name="stock" type="number" min="0" value={form.stock} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" required /></label>
          <label className="text-sm text-text-secondary">Image URL 1<input name="image1" value={form.image1} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" /></label>
          <label className="text-sm text-text-secondary">Image URL 2<input name="image2" value={form.image2} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" /></label>
          <label className="text-sm text-text-secondary">Image URL 3<input name="image3" value={form.image3} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" /></label>

          <div className="md:col-span-2 rounded-xl border border-border-default p-3">
            <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <input type="checkbox" name="isDeal" checked={form.isDeal} onChange={onChange} />
              Enable deal
            </label>
            {form.isDeal && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <label className="text-sm text-text-secondary">Deal Price<input name="dealPrice" type="number" min="1" value={form.dealPrice} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" /></label>
                <label className="text-sm text-text-secondary">Deal Expiry<input name="dealExpiresAt" type="datetime-local" value={form.dealExpiresAt} onChange={onChange} className="mt-1 w-full h-10 rounded-xl border border-border-default bg-white px-3" /></label>
              </div>
            )}
          </div>

          <label className="md:col-span-2 text-sm text-text-secondary">
            Description
            <textarea name="description" value={form.description} onChange={onChange} className="mt-1 w-full min-h-[140px] rounded-xl border border-border-default bg-white px-3 py-2.5" required />
          </label>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={saving} className="h-11 rounded-xl bg-brand-primary px-6 text-white text-sm font-semibold hover:bg-brand-hover disabled:opacity-60">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
};

export default ProductEdit;
