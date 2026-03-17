import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProductListing = () => {
  const { products, categories, addToCart } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = (searchParams.get('q') || '').toLowerCase();
  const selectedCategory = searchParams.get('category') || 'All';
  const sort = searchParams.get('sort') || 'featured';

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'All') {
      result = result.filter((product) => product.category === selectedCategory);
    }

    if (query) {
      result = result.filter((product) => {
        const bag = `${product.name} ${product.brand} ${product.description} ${product.category}`.toLowerCase();
        return bag.includes(query);
      });
    }

    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sort === 'deals') result = result.filter((product) => product.isDeal && product.dealPrice);

    return result;
  }, [products, query, selectedCategory, sort]);

  const updateFilters = (next) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === 'All' || value === 'featured') params.delete(key);
      else params.set(key, value);
    });
    setSearchParams(params);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-5">
      <div className="bg-white border rounded-lg p-4 mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-sm">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <label className="text-sm ml-2">Sort:</label>
          <select
            value={sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="deals">Deals</option>
          </select>
        </div>

        <p className="text-sm text-gray-600">{filteredProducts.length} results</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const productId = product._id || product.id;
          const isDeal = product.isDeal && product.dealPrice;
          const price = isDeal ? product.dealPrice : product.price;

          return (
            <article key={productId} className="bg-white border rounded-md p-3 flex flex-col">
              <Link to={`/product/${productId}`}>
                <img src={product.images?.[0]} alt={product.name} className="w-full h-40 object-cover rounded" />
                <h3 className="mt-2 text-sm font-medium line-clamp-2 min-h-10">{product.name}</h3>
              </Link>

              <p className="text-xs text-gray-600 mt-1">{product.brand}</p>

              <div className="mt-2">
                <p className="font-semibold text-[#B12704]">${Number(price).toFixed(2)}</p>
                {isDeal && <p className="text-xs text-gray-500 line-through">${Number(product.price).toFixed(2)}</p>}
              </div>

              <button
                onClick={() => addToCart(product, 1)}
                className="mt-3 bg-[#ffd814] hover:bg-[#f7ca00] text-black text-sm py-1.5 rounded"
              >
                Add to Cart
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ProductListing;
