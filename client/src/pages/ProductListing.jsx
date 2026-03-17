import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, ListFilter, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ui/ProductCard';
import FilterSidebar from '../components/listing/FilterSidebar';
import SkeletonCard from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';

const ProductListing = () => {
  const { products, facets, categories, loadingProducts } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter params
  const q = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category') || 'All';
  const brand = searchParams.get('brand') || 'All';
  const rating = Number(searchParams.get('rating') || '0');
  const maxPrice = Number(searchParams.get('maxPrice') || '200000');
  const sort = searchParams.get('sort') || 'featured';

  const brands = useMemo(() => 
    Array.from(new Set(products.map(p => p.brand).filter(Boolean))), 
  [products]);

  const [isFiltering, setIsFiltering] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchQuery = !q || p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q);
      const matchCat = category === 'All' || p.category === category;
      const matchBrand = brand === 'All' || p.brand === brand;
      const matchRating = (p.averageRating || 4.5) >= rating;
      const matchPrice = (p.dealPrice || p.price) <= maxPrice;
      return matchQuery && matchCat && matchBrand && matchRating && matchPrice;
    });

    if (sort === 'price-low') result.sort((a,b) => (a.dealPrice || a.price) - (b.dealPrice || b.price));
    if (sort === 'price-high') result.sort((a,b) => (b.dealPrice || b.price) - (a.dealPrice || a.price));
    if (sort === 'rating') result.sort((a,b) => (b.averageRating || 4.5) - (a.averageRating || 4.5));

    return result;
  }, [products, q, category, brand, rating, maxPrice, sort]);

  // Simulate network delay for filter changes so it feels like a real query
  React.useEffect(() => {
    if (!loadingProducts) {
      setIsFiltering(true);
      const timer = setTimeout(() => setIsFiltering(false), 400); // 400ms mock delay
      return () => clearTimeout(timer);
    }
  }, [q, category, brand, rating, maxPrice, sort, loadingProducts]);

  const updateSort = (val) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', val);
    setSearchParams(next);
  };


  return (
    <div className="bg-white min-h-screen">
      {/* Search Result Information */}
      <div className="bg-surface-secondary border-b border-border-default py-3">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-small text-text-secondary">
            {q ? (
              <span className="flex items-center gap-1.5 flex-wrap">
                Showing results for <span className="text-text-primary font-bold italic">"{q}"</span> 
                in <span className="text-text-primary font-bold">{category}</span>
              </span>
            ) : (
              <span>Explore products in <span className="text-text-primary font-bold">{category}</span></span>
            )}
            <span className="ml-2 text-text-muted font-medium">({filteredProducts.length} items found)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-caption font-bold text-text-secondary whitespace-nowrap hidden sm:block">Sort by:</span>
            <select 
              value={sort}
              onChange={(e) => updateSort(e.target.value)}
              className="bg-white border border-border-default rounded-lg px-4 py-2 text-small font-bold text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer shadow-sm min-w-[160px]"
            >
              <option value="featured">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="hidden lg:block w-[280px] flex-shrink-0">
          <FilterSidebar categories={categories} brands={brands} facets={facets} />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-8 bg-surface-secondary p-4 rounded-pro border border-border-default shadow-sm">
            <button className="flex items-center gap-2.5 text-small font-bold text-brand-primary">
              <div className="bg-brand-primary text-white p-1.5 rounded-md">
                <ListFilter size={18} />
              </div>
              REFINE SEARCH
            </button>
            <div className="text-caption font-bold text-text-muted uppercase tracking-tighter">{filteredProducts.length} Matches</div>
          </div>

          {/* Sponsored Row (Simulated) */}
          {filteredProducts.length > 0 && !loadingProducts && !q && (
            <div className="mb-12 p-6 bg-surface-secondary/50 rounded-pro border border-border-default relative">
              <h3 className="text-small font-bold text-text-secondary mb-6 flex items-center gap-2">
                Sponsored
                <Info size={14} className="text-text-muted" />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 4).map(p => (
                  <ProductCard key={`sponsored-${p._id || p.id}`} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          {loadingProducts || isFiltering ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20">
              <EmptyState 
                type="search" 
                title="No items found" 
                message="We couldn't find what you're looking for. Please try different filters or keywords."
                actionLabel="Reset All Filters"
                actionLink="/products"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
