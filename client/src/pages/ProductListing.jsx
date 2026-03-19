import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ListFilter, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ui/ProductCard';
import FilterSidebar from '../components/listing/FilterSidebar';
import SkeletonCard from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';

const ProductListing = () => {
  const { products, facets, categories, loadingProducts } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category') || 'All';
  const selectedBrands = searchParams.getAll('brand');
  const rating = Number(searchParams.get('rating') || '0');
  const maxPrice = Number(searchParams.get('maxPrice') || '200000');
  const sort = searchParams.get('sort') || 'featured';

  const brands = useMemo(
    () => Array.from(new Set((products || []).map((p) => p.brand).filter(Boolean))),
    [products]
  );

  const [isFiltering, setIsFiltering] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = (products || []).filter((p) => {
      if (!p) return false;

      const productName = p.name || '';
      const productBrand = p.brand || '';
      const matchQuery = !q || productName.toLowerCase().includes(q) || productBrand.toLowerCase().includes(q);
      const matchCat = category === 'All' || p.category === category;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchRating = (p.averageRating || 4.5) >= rating;
      const matchPrice = (p.dealPrice || p.price) <= maxPrice;
      return matchQuery && matchCat && matchBrand && matchRating && matchPrice;
    });

    if (sort === 'price-low') result.sort((a, b) => (a.dealPrice || a.price) - (b.dealPrice || b.price));
    if (sort === 'price-high') result.sort((a, b) => (b.dealPrice || b.price) - (a.dealPrice || a.price));
    if (sort === 'rating') result.sort((a, b) => (b.averageRating || 4.5) - (a.averageRating || 4.5));

    return result;
  }, [products, q, category, JSON.stringify(selectedBrands), rating, maxPrice, sort]);

  React.useEffect(() => {
    if (!loadingProducts) {
      setIsFiltering(true);
      const timer = setTimeout(() => setIsFiltering(false), 300);
      return () => clearTimeout(timer);
    }
  }, [q, category, JSON.stringify(selectedBrands), rating, maxPrice, sort, loadingProducts]);

  const updateSort = (val) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', val);
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen pb-10">
      <section className="site-shell pt-5">
        <div className="panel px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-sm text-text-secondary">
            {q ? (
              <span>
                Showing results for <span className="font-bold text-text-primary">"{q}"</span> in{' '}
                <span className="font-bold text-text-primary">{category}</span>
              </span>
            ) : (
              <span>
                Explore products in <span className="font-bold text-text-primary">{category}</span>
              </span>
            )}
            <span className="ml-2 text-text-muted">({filteredProducts.length} found)</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden sm:block text-xs font-bold uppercase tracking-[0.14em] text-text-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => updateSort(e.target.value)}
              className="h-10 rounded-xl border border-border-default bg-white px-3 text-sm font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
            >
              <option value="featured">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </section>

      <section className="site-shell mt-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="panel p-4">
            <FilterSidebar categories={categories} brands={brands} facets={facets} />
          </div>
        </aside>

        <main className="flex-1">
          <div className="lg:hidden panel px-4 py-3 mb-5 flex items-center justify-between">
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
              <ListFilter size={16} />
              Refine Search
            </button>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">{filteredProducts.length} matches</span>
          </div>

          {filteredProducts.length > 0 && !loadingProducts && !q && (
            <div className="panel p-4 md:p-5 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted mb-4 inline-flex items-center gap-1.5">
                Sponsored
                <Info size={13} />
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                {filteredProducts.slice(0, 4).map((p) => (
                  <ProductCard key={`sponsored-${p._id || p.id}`} product={p} />
                ))}
              </div>
            </div>
          )}

          {loadingProducts || isFiltering ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="panel p-8 md:p-10">
              <EmptyState
                type="search"
                title="No items found"
                message="Try changing filters or searching with another keyword."
                actionLabel="Reset All Filters"
                actionLink="/products"
              />
            </div>
          )}
        </main>
      </section>
    </div>
  );
};

export default ProductListing;
