import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';

const AddProduct = () => {
  const navigate = useNavigate();
  const { createProduct } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await createProduct({
        name: form.name,
        brand: form.brand,
        category: form.category,
        description: form.description,
        price: form.price,
        stock: form.stock,
        images: form.image ? [form.image] : [],
        tags: [form.category.toLowerCase(), form.brand.toLowerCase()],
        variants: [],
        features: []
      });
      navigate('/seller/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto px-3 md:px-6 py-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="neo-panel rounded-3xl p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Create Product Node</h1>
          <Link to="/seller/dashboard" className="text-sm text-cyan-200 hover:text-cyan-100">
            Back to Seller Dashboard
          </Link>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="name" value={form.name} onChange={onChange} placeholder="Product name" className="rounded-lg px-3 py-2 bg-[#0b1530] border border-cyan-200/30" required />
          <input name="brand" value={form.brand} onChange={onChange} placeholder="Brand" className="rounded-lg px-3 py-2 bg-[#0b1530] border border-cyan-200/30" required />

          <select name="category" value={form.category} onChange={onChange} className="rounded-lg px-3 py-2 bg-[#0b1530] border border-cyan-200/30">
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Kitchen</option>
            <option>Books</option>
            <option>Computers</option>
            <option>Sports</option>
            <option>Beauty</option>
          </select>

          <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} placeholder="Price" className="rounded-lg px-3 py-2 bg-[#0b1530] border border-cyan-200/30" required />
          <input name="stock" type="number" min="0" value={form.stock} onChange={onChange} placeholder="Stock" className="rounded-lg px-3 py-2 bg-[#0b1530] border border-cyan-200/30" required />
          <input name="image" value={form.image} onChange={onChange} placeholder="Image URL (optional)" className="rounded-lg px-3 py-2 bg-[#0b1530] border border-cyan-200/30" />

          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Description"
            className="rounded-lg px-3 py-2 bg-[#0b1530] border border-cyan-200/30 md:col-span-2"
            rows={4}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="md:col-span-2 neo-button py-2 rounded-lg disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProduct;
