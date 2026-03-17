import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  const maxPrice = Number(searchParams.get('maxPrice') || '5000');
  const sort = searchParams.get('sort') || 'featured';

  const brands = useMemo(() => 
    Array.from(new Set(products.map(p => p.brand).filter(Boolean))), 
  [products]);

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

  const updateSort = (val) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', val);
    setSearchParams(next);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Search Result Information */}
      <div className="bg-surface-secondary border-b border-border-default py-4">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-small text-text-secondary">
            {q ? (
              <span>Results for <span className="text-text-primary font-bold">"{q}"</span> in <span className="text-text-primary font-bold">{category}</span></span>
            ) : (
              <span>Showing all products in <span className="text-text-primary font-bold">{category}</span></span>
            )}
            <span className="ml-2 text-text-muted">({filteredProducts.length} results)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-caption font-bold text-text-secondary whitespace-nowrap">Sort by:</span>
            <select 
              value={sort}
              onChange={(e) => updateSort(e.target.value)}
              className="bg-white border border-border-default rounded-lg px-3 py-1.5 text-small font-medium focus:outline-none focus:border-brand-primary"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 flex gap-8">
        {/* Sidebar Filters */}
        <FilterSidebar categories={categories} brands={brands} facets={facets} />

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-6 bg-surface-secondary p-3 rounded-lg border border-border-default">
            <button className="flex items-center gap-2 text-small font-bold text-text-primary">
              <ListFilter size={18} /> Filters
            </button>
            <div className="text-caption text-text-muted">{filteredProducts.length} Results</div>
          </div>

          {/* Sponsored Row (Simulated) */}
          {filteredProducts.length > 0 && !loadingProducts && (
            <div className="mb-10 p-6 bg-brand-light/20 rounded-pro border border-brand-primary/10">
              <div className="flex items-center gap-1.5 mb-6 text-caption font-bold text-brand-primary">
                <Info size={14} /> SPONSORED
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 4).map(p => (
                  <ProductCard key={`sponsored-${p._id || p.id}`} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id || product.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 4) * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              type="search" 
              title="No matching products" 
              message="Try adjusting your filters or search query to find what you're looking for."
              actionLabel="Clear all filters"
              actionLink="/products"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
