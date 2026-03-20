import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Plus, Sparkles, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../../context/StoreContext';

const emptyVariant = { color: '', size: '', priceDelta: '' };

const AddProduct = () => {
  const navigate = useNavigate();
  const { createProduct } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);

  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: 'Electronics',
    sku: '',
    price: '',
    stock: '',
    reorderLevel: '5',
    isDeal: false,
    dealPrice: '',
    dealExpiresAt: '',
    description: '',
    image1: '',
    image2: '',
    image3: '',
    tagsInput: '',
    featuresInput: '',
  });

  const [variants, setVariants] = useState([emptyVariant]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const setVariantField = (idx, key, value) => {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [key]: value } : v)));
  };

  const addVariant = () => {
    setVariants((prev) => [...prev, emptyVariant]);
  };

  const removeVariant = (idx) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAIDescription = () => {
    if (!form.name || !form.category) {
      toast.error('Enter product name and category first');
      return;
    }

    setIsGeneratingInfo(true);
    const generated = `${form.name} is a high-performance ${form.category.toLowerCase()} product built for reliability, speed, and long-term value. It combines durable build quality, optimized day-to-day usability, and trusted after-sales confidence for modern buyers.

Key strengths include cleaner design, practical feature depth, and competitive pricing for your target segment. This listing is crafted to improve conversion with clear value communication and operation-friendly fulfillment.`;

    setTimeout(() => {
      setForm((prev) => ({ ...prev, description: generated }));
      setIsGeneratingInfo(false);
      toast.success('AI description generated');
    }, 700);
  };

  const images = [form.image1, form.image2, form.image3].filter(Boolean);
  const tags = form.tagsInput
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const features = form.featuresInput
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);

  const normalizedVariants = variants
    .map((v) => ({
      color: v.color.trim(),
      size: v.size.trim(),
      priceDelta: Number(v.priceDelta || 0),
    }))
    .filter((v) => v.color || v.size || v.priceDelta);

  const price = Number(form.price || 0);
  const dealPrice = Number(form.dealPrice || 0);

  const checks = useMemo(() => {
    return {
      hasBasics: Boolean(form.name && form.brand && form.category),
      hasPricing: price > 0 && Number(form.stock) >= 0,
      hasDescription: form.description.trim().length >= 60,
      hasImage: images.length > 0,
      hasDealValidity: !form.isDeal || (dealPrice > 0 && dealPrice < price && Boolean(form.dealExpiresAt)),
    };
  }, [form, images.length, price, dealPrice]);

  const qualityScore = useMemo(() => {
    const values = Object.values(checks);
    const passed = values.filter(Boolean).length;
    return Math.round((passed / values.length) * 100);
  }, [checks]);

  const canSubmit = Object.values(checks).every(Boolean);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error('Please complete all required product quality checks');
      return;
    }

    setIsSubmitting(true);
    try {
      await createProduct({
        name: form.name,
        brand: form.brand,
        category: form.category,
        description: form.description,
        price,
        stock: Number(form.stock),
        images: images.length
          ? images
          : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
        tags: tags.length ? tags : [form.category.toLowerCase(), form.brand.toLowerCase()],
        variants: normalizedVariants,
        features,
        isDeal: Boolean(form.isDeal),
        dealPrice: form.isDeal ? dealPrice : undefined,
        dealExpiresAt: form.isDeal && form.dealExpiresAt ? new Date(form.dealExpiresAt) : undefined,
        sku: form.sku || undefined,
        reorderLevel: Number(form.reorderLevel || 0),
      });
      toast.success('Product published successfully');
      navigate('/seller/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary py-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/seller/dashboard" className="w-10 h-10 bg-white border border-border-default rounded-full flex items-center justify-center hover:bg-surface-secondary transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-h2 font-display text-text-primary">Add New Product</h1>
            <p className="text-small text-text-muted">Enterprise listing workflow with quality checks, variants and deal controls.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">
          <form onSubmit={onSubmit} className="panel p-6 md:p-8 space-y-7">
            <section>
              <h3 className="text-base font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm text-text-secondary">
                  Product Name *
                  <input name="name" value={form.name} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" required />
                </label>
                <label className="text-sm text-text-secondary">
                  Brand *
                  <input name="brand" value={form.brand} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" required />
                </label>
                <label className="text-sm text-text-secondary">
                  Category *
                  <select name="category" value={form.category} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5">
                    <option>Electronics</option>
                    <option>Mobiles</option>
                    <option>Fashion</option>
                    <option>Home</option>
                    <option>Books</option>
                    <option>Beauty</option>
                    <option>Groceries</option>
                    <option>Appliances</option>
                    <option>Sports</option>
                    <option>Toys</option>
                    <option>Computers</option>
                    <option>Automotive</option>
                    <option>Health</option>
                  </select>
                </label>
                <label className="text-sm text-text-secondary">
                  SKU
                  <input name="sku" value={form.sku} onChange={onChange} placeholder="e.g. ELX-SONY-001" className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" />
                </label>
              </div>
            </section>

            <section>
              <h3 className="text-base font-semibold mb-4">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="text-sm text-text-secondary">
                  Base Price (₹) *
                  <input name="price" type="number" min="1" value={form.price} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" required />
                </label>
                <label className="text-sm text-text-secondary">
                  Stock *
                  <input name="stock" type="number" min="0" value={form.stock} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" required />
                </label>
                <label className="text-sm text-text-secondary">
                  Reorder Level
                  <input name="reorderLevel" type="number" min="0" value={form.reorderLevel} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" />
                </label>
              </div>
              <div className="mt-4 rounded-xl border border-border-default p-3">
                <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
                  <input type="checkbox" name="isDeal" checked={form.isDeal} onChange={onChange} />
                  Enable deal pricing
                </label>
                {form.isDeal && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <label className="text-sm text-text-secondary">
                      Deal Price (₹)
                      <input name="dealPrice" type="number" min="1" value={form.dealPrice} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" />
                    </label>
                    <label className="text-sm text-text-secondary">
                      Deal Expiry
                      <input name="dealExpiresAt" type="datetime-local" value={form.dealExpiresAt} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" />
                    </label>
                  </div>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">Description</h3>
                <button
                  type="button"
                  onClick={handleAIDescription}
                  disabled={isGeneratingInfo}
                  className="h-8 rounded-lg border border-border-default px-3 text-xs font-semibold text-brand-primary inline-flex items-center gap-1"
                >
                  <Sparkles size={13} className={isGeneratingInfo ? 'animate-spin' : ''} />
                  {isGeneratingInfo ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Write a strong conversion-focused product description..."
                className="w-full min-h-[160px] rounded-xl border border-border-default bg-white px-3 py-2.5"
                required
              />
            </section>

            <section>
              <h3 className="text-base font-semibold mb-4">Media, Tags & Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="text-sm text-text-secondary">Image URL 1 *<input name="image1" value={form.image1} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" /></label>
                <label className="text-sm text-text-secondary">Image URL 2<input name="image2" value={form.image2} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" /></label>
                <label className="text-sm text-text-secondary">Image URL 3<input name="image3" value={form.image3} onChange={onChange} className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" /></label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <label className="text-sm text-text-secondary">
                  Tags (comma separated)
                  <input name="tagsInput" value={form.tagsInput} onChange={onChange} placeholder="wireless, anc, premium" className="mt-1 w-full rounded-xl border border-border-default bg-white px-3 py-2.5" />
                </label>
                <label className="text-sm text-text-secondary">
                  Features (one per line)
                  <textarea name="featuresInput" value={form.featuresInput} onChange={onChange} placeholder={'40h battery\nBluetooth 5.3\nType-C fast charge'} className="mt-1 w-full min-h-[88px] rounded-xl border border-border-default bg-white px-3 py-2.5" />
                </label>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">Variants</h3>
                <button type="button" onClick={addVariant} className="h-8 rounded-lg border border-border-default px-3 text-xs font-semibold inline-flex items-center gap-1">
                  <Plus size={12} /> Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {variants.map((variant, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_140px_48px] gap-2">
                    <input value={variant.color} onChange={(e) => setVariantField(idx, 'color', e.target.value)} placeholder="Color" className="rounded-xl border border-border-default bg-white px-3 py-2.5" />
                    <input value={variant.size} onChange={(e) => setVariantField(idx, 'size', e.target.value)} placeholder="Size" className="rounded-xl border border-border-default bg-white px-3 py-2.5" />
                    <input type="number" value={variant.priceDelta} onChange={(e) => setVariantField(idx, 'priceDelta', e.target.value)} placeholder="Price Delta" className="rounded-xl border border-border-default bg-white px-3 py-2.5" />
                    <button type="button" onClick={() => removeVariant(idx)} className="rounded-xl border border-border-default bg-white grid place-items-center text-danger"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            </section>

            <div className="pt-4 border-t border-border-default flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !canSubmit}
                className="h-11 rounded-xl bg-brand-primary px-6 text-white text-sm font-semibold hover:bg-brand-hover disabled:opacity-60"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Product'}
              </button>
            </div>
          </form>

          <aside className="sticky top-[96px] space-y-4">
            <div className="panel p-5">
              <h3 className="text-base font-semibold">Listing Quality</h3>
              <p className={`mt-2 text-3xl font-display font-bold ${qualityScore >= 85 ? 'text-success' : qualityScore >= 60 ? 'text-warning' : 'text-danger'}`}>{qualityScore}%</p>
              <div className="mt-2 h-2 rounded-full bg-surface-secondary overflow-hidden">
                <div className={`${qualityScore >= 85 ? 'bg-success' : qualityScore >= 60 ? 'bg-warning' : 'bg-danger'} h-full`} style={{ width: `${qualityScore}%` }} />
              </div>
              <div className="mt-4 space-y-2 text-xs text-text-secondary">
                <p className="flex items-center justify-between"><span>Basics</span><CheckCircle2 size={14} className={checks.hasBasics ? 'text-success' : 'text-text-muted'} /></p>
                <p className="flex items-center justify-between"><span>Pricing</span><CheckCircle2 size={14} className={checks.hasPricing ? 'text-success' : 'text-text-muted'} /></p>
                <p className="flex items-center justify-between"><span>Description</span><CheckCircle2 size={14} className={checks.hasDescription ? 'text-success' : 'text-text-muted'} /></p>
                <p className="flex items-center justify-between"><span>Images</span><CheckCircle2 size={14} className={checks.hasImage ? 'text-success' : 'text-text-muted'} /></p>
                <p className="flex items-center justify-between"><span>Deal validity</span><CheckCircle2 size={14} className={checks.hasDealValidity ? 'text-success' : 'text-text-muted'} /></p>
              </div>
            </div>

            <div className="panel p-5">
              <h3 className="text-base font-semibold">Live Summary</h3>
              <div className="mt-3 space-y-1.5 text-sm text-text-secondary">
                <p><strong>Name:</strong> {form.name || '—'}</p>
                <p><strong>Brand:</strong> {form.brand || '—'}</p>
                <p><strong>Category:</strong> {form.category || '—'}</p>
                <p><strong>Price:</strong> ₹{price.toLocaleString('en-IN')}</p>
                <p><strong>Stock:</strong> {Number(form.stock || 0)}</p>
                <p><strong>Deal:</strong> {form.isDeal ? `₹${dealPrice.toLocaleString('en-IN')}` : 'No deal'}</p>
                <p><strong>Tags:</strong> {tags.length}</p>
                <p><strong>Variants:</strong> {normalizedVariants.length}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
