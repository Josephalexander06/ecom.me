import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';

const FilterGroup = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border-default last:border-0 pb-4 mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-small font-bold text-text-primary mb-3 hover:text-brand-primary transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="space-y-2">{children}</div>}
    </div>
  );
};

const FilterSidebar = ({ categories, brands, facets }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All';
  const activeRating = searchParams.get('rating') || '0';
  const activePrice = searchParams.get('maxPrice') || '5000';

  const updateParams = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === '0') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <aside className="w-[260px] flex-shrink-0 hidden lg:block sticky top-[150px] self-start max-h-[80vh] overflow-y-auto no-scrollbar pr-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-body font-bold text-text-primary">Filters</h2>
        <button 
          onClick={() => setSearchParams({})}
          className="text-caption font-bold text-brand-primary hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Departments */}
      <FilterGroup title="Department" defaultOpen={true}>
        {categories.map(cat => {
          const count = facets?.categories?.find(f => f._id === cat)?.count || 0;
          return (
            <button
              key={cat}
              onClick={() => updateParams('category', cat)}
              className={`flex items-center justify-between text-small text-left w-full transition-colors ${
                activeCategory === cat ? 'text-brand-primary font-bold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <span>{cat}</span>
              {cat !== 'All' && <span className="text-caption font-mono text-text-muted">{count}</span>}
            </button>
          );
        })}
      </FilterGroup>

      {/* Customer Reviews */}
      <FilterGroup title="Customer Rating" defaultOpen={true}>
        {[4, 3, 2, 1].map(stars => (
          <button
            key={stars}
            onClick={() => updateParams('rating', String(stars))}
            className="flex items-center gap-2 group w-full"
          >
            <div className={`flex items-center ${activeRating === String(stars) ? 'text-rating' : 'text-text-muted group-hover:text-rating'}`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill={i < stars ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className={`text-small ${activeRating === String(stars) ? 'text-text-primary font-bold' : 'text-text-secondary'}`}>
              & Up
            </span>
          </button>
        ))}
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Price Range" defaultOpen={true}>
        <div className="px-1 pt-2">
          <input 
            type="range" 
            min="0" 
            max="200000" 
            step="1000"
            value={activePrice}
            onChange={(e) => updateParams('maxPrice', e.target.value)}
            className="w-full accent-brand-primary cursor-pointer h-1.5 bg-surface-secondary rounded-lg appearance-none"
          />
          <div className="flex justify-between mt-4 text-caption font-bold text-text-secondary">
            <span className="bg-surface-secondary px-2 py-1 rounded">₹0</span>
            <span className="bg-brand-primary/10 text-brand-primary px-2 py-1 rounded">₹{activePrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </FilterGroup>

      {/* Brands */}
      <FilterGroup title="Brand">
        {brands.slice(0, 12).map(brand => {
          const count = facets?.brands?.find(f => f._id === brand)?.count || 0;
          return (
            <label key={brand} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={searchParams.get('brand') === brand}
                  onChange={(e) => updateParams('brand', e.target.checked ? brand : null)}
                  className="w-4 h-4 rounded border-border-default text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-small text-text-secondary group-hover:text-text-primary transition-colors">
                  {brand}
                </span>
              </div>
              <span className="text-caption font-mono text-text-muted">{count}</span>
            </label>
          );
        })}
      </FilterGroup>
    </aside>
  );
};

export default FilterSidebar;
