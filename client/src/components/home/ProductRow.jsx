import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ui/ProductCard';

const ProductRow = ({ eyebrow, title, products = [] }) => {
  return (
    <div className="w-full">
      <div className="mb-5 md:mb-6 flex items-end justify-between gap-3">
        <div>
          <span className="chip">{eyebrow}</span>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-text-primary">{title}</h2>
        </div>
        <Link
          to="/products"
          className="shrink-0 inline-flex items-center gap-1 rounded-pill border border-border-default bg-white px-4 py-2 text-xs md:text-sm font-semibold text-text-secondary hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
        >
          View all
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
        {products.map((product) => (
          <div key={product.id || product._id} className="min-w-[210px] md:min-w-[238px]">
            <ProductCard product={product} compact />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRow;
