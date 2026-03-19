import React from 'react';
import ProductCard from '../ui/ProductCard';

const ProductRow = ({ eyebrow, title, products = [] }) => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="inline-flex items-center px-3 py-1 bg-brand-light rounded-full text-brand-primary text-[10px] font-bold tracking-widest mb-2">
          {eyebrow}
        </div>
        <h2 className="text-h3 md:text-h2 font-display text-text-primary">{title}</h2>
      </div>

      <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 md:-mx-8 md:px-8">
        {products.map((product) => (
          <div key={product.id || product._id} className="min-w-[180px] md:min-w-[220px]">
            <ProductCard product={product} compact={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRow;
