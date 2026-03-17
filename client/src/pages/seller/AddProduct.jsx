import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { Sparkles, Image as ImageIcon, CheckCircle, ArrowLeft } from 'lucide-react';
import ProductCard from '../../components/ui/ProductCard';

const AddProduct = () => {
  const navigate = useNavigate();
  const { createProduct } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: 'Electronics',
    price: '',
    stock: '',
    description: '',
    image: ''
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAIDescription = () => {
    if (!form.name || !form.category) {
      alert("Please enter a product name and category first for the AI to analyze.");
      return;
    }
    
    setIsGeneratingInfo(true);
    setForm(prev => ({ ...prev, description: '' }));
    
    const mockDescription = `Experience the next evolution of ${form.category.toLowerCase()} with the premium ${form.name}. Designed for uncompromising performance and crafted with aerospace-grade materials, this device seamlessly integrates into your daily life. Features include ultra-responsive intelligent sensors, adaptive power management, and a stunning minimalist design that commands attention.\n\nBuilt for professionals and enthusiasts alike, it delivers unparalleled precision and reliability when you need it most.`;
    
    // Simulate typewriter effect
    let i = 0;
    const typeWriter = setInterval(() => {
      setForm(prev => ({ ...prev, description: mockDescription.substring(0, i) }));
      i++;
      if (i > mockDescription.length) {
        clearInterval(typeWriter);
        setIsGeneratingInfo(false);
      }
    }, 10); // Fast typing speed
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await createProduct({
        name: form.name,
        brand: form.brand,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.image ? [form.image] : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'],
        tags: [form.category.toLowerCase(), form.brand.toLowerCase()],
        variants: [],
        features: []
      });
      navigate('/seller/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create a mock product for the Live Preview
  const previewProduct = {
    id: 'preview',
    name: form.name || 'Your Product Name',
    brand: form.brand || 'Your Brand',
    category: form.category,
    price: form.price ? Number(form.price) : 2999,
    averageRating: 0,
    reviewCount: 0,
    images: [form.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80']
  };

  return (
    <div className="bg-surface-primary min-h-screen py-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/seller/dashboard" className="w-10 h-10 bg-white border border-border-default rounded-full flex items-center justify-center hover:bg-surface-secondary transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-h2 font-display text-text-primary">Add New Product</h1>
            <p className="text-small text-text-muted">Fill in the details to list your item on the global marketplace.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 items-start">
          
          {/* Main Form Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white border border-border-default rounded-pro p-6 md:p-10 shadow-sm"
          >
            <form onSubmit={onSubmit} className="space-y-8">
              
              {/* Section 1: Basic Info */}
              <div>
                <h3 className="text-body font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border-default pb-2">
                  <div className="w-1.5 h-4 bg-brand-primary rounded-full" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-caption font-bold text-text-secondary">Product Name *</label>
                    <input name="name" value={form.name} onChange={onChange} placeholder="e.g. Aether Wireless Headphones" className="w-full bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-caption font-bold text-text-secondary">Brand *</label>
                    <input name="brand" value={form.brand} onChange={onChange} placeholder="e.g. Sony, Apple, Generic" className="w-full bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-caption font-bold text-text-secondary">Category *</label>
                    <select name="category" value={form.category} onChange={onChange} className="w-full bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors">
                      <option>Electronics</option>
                      <option>Fashion</option>
                      <option>Home & Kitchen</option>
                      <option>Books</option>
                      <option>Computers</option>
                      <option>Sports</option>
                      <option>Beauty</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Inventory */}
              <div>
                <h3 className="text-body font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border-default pb-2 mt-8">
                  <div className="w-1.5 h-4 bg-brand-primary rounded-full" />
                  Pricing & Inventory
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                    <label className="text-caption font-bold text-text-secondary">Selling Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">₹</span>
                      <input name="price" type="number" min="0" step="1" value={form.price} onChange={onChange} placeholder="0.00" className="w-full bg-surface-secondary border border-border-default rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-brand-primary transition-colors font-mono" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-caption font-bold text-text-secondary">Available Stock *</label>
                    <input name="stock" type="number" min="0" value={form.stock} onChange={onChange} placeholder="e.g. 50" className="w-full bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors" required />
                  </div>
                </div>
              </div>

              {/* Section 3: Media */}
              <div>
                <h3 className="text-body font-bold text-text-primary mb-4 flex items-center gap-2 border-b border-border-default pb-2 mt-8">
                  <div className="w-1.5 h-4 bg-brand-primary rounded-full" />
                  Product Media
                </h3>
                <div className="space-y-4">
                  <div className="w-full border-2 border-dashed border-border-default rounded-xl p-8 flex flex-col items-center justify-center text-center bg-surface-secondary/50 hover:bg-surface-secondary transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <ImageIcon size={28} className="text-text-muted" />
                    </div>
                    <p className="text-small font-bold text-text-primary">Drag & Drop product images here</p>
                    <p className="text-caption text-text-muted mt-1">or click to browse from your computer (Mocked)</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-border-default" />
                    <span className="text-caption font-bold text-text-muted uppercase tracking-widest">OR USE URL</span>
                    <div className="h-[1px] flex-1 bg-border-default" />
                  </div>

                  <div className="space-y-1.5">
                    <input name="image" value={form.image} onChange={onChange} placeholder="Image URL (e.g. https://images.unsplash.com/...)" className="w-full bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors text-small" />
                  </div>
                </div>
              </div>

              {/* Section 4: AI Description */}
              <div>
                <div className="flex items-end justify-between mb-4 border-b border-border-default pb-2 mt-8">
                  <h3 className="text-body font-bold text-text-primary flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-brand-primary rounded-full" />
                    Copywriting
                  </h3>
                  <button 
                    type="button"
                    onClick={handleAIDescription}
                    disabled={isGeneratingInfo}
                    className="flex items-center gap-2 text-[11px] font-bold text-brand-primary bg-brand-light/30 px-3 py-1.5 rounded-full hover:bg-brand-light transition-colors border border-brand-primary/20"
                  >
                    <Sparkles size={14} className={isGeneratingInfo ? "animate-spin" : ""} />
                    {isGeneratingInfo ? 'Generating AI Copy...' : 'Generate with AI'}
                  </button>
                </div>
                <div className="space-y-1.5">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={onChange}
                    placeholder="Describe your product in detail..."
                    className="w-full bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors min-h-[160px] text-small leading-relaxed"
                    required
                  />
                  <p className="text-caption text-text-muted italic flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-success" />
                    Tip: Use our AI tool to automatically write SEO-optimized descriptions based on your product name.
                  </p>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-6 border-t border-border-default flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-brand-primary text-white px-10 py-4 rounded-pro font-bold hover:bg-brand-hover transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20"
                >
                  {isSubmitting ? 'Publishing to Store...' : 'Publish Product'}
                </button>
              </div>

            </form>
          </motion.div>

          {/* Sidebar: Live Preview Area */}
          <aside className="sticky top-[120px] hidden xl:block">
            <h3 className="text-small font-bold text-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Live Store Preview
            </h3>
            <div className="bg-white p-6 border border-border-default rounded-pro shadow-sm h-[450px]">
              {/* Reuse the actual ProductCard component for a 1:1 preview */}
              <ProductCard product={previewProduct} />
            </div>
            <p className="text-caption text-text-muted text-center mt-4">
              This is how your product will look to customers on the Listing and Homepage grids.
            </p>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;
