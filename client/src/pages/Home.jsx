import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Home = () => {
  const { products, addToCart, categories, loadingProducts } = useStore();

  const deals = useMemo(
    () => products.filter((product) => product.isDeal && product.dealPrice).slice(0, 4),
    [products]
  );

  const featured = useMemo(() => products.slice(0, 8), [products]);

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-6 py-4 md:py-6 space-y-6">
      <section className="bg-gradient-to-r from-[#37475A] to-[#232F3E] rounded-lg text-white p-6 md:p-10">
        <p className="text-xs uppercase tracking-wide text-gray-200">Big Savings Week</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-2">Everything You Need, Delivered Fast</h1>
        <p className="text-sm md:text-base text-gray-100 mt-3 max-w-2xl">
          Shop electronics, home essentials, fashion, and more with an experience inspired by top ecommerce marketplaces.
        </p>
        <Link
          to="/products"
          className="inline-block mt-5 bg-[#ffd814] hover:bg-[#f7ca00] text-black px-5 py-2.5 rounded-md font-semibold"
        >
          Start Shopping
        </Link>
      </section>

      <section className="bg-white rounded-lg border p-4">
        <h2 className="font-bold text-lg mb-3">Shop by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.slice(1).map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="px-3 py-1.5 text-sm border rounded-full hover:border-[#ff9900] hover:text-[#B12704]"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Today&apos;s Deals</h2>
          <Link to="/products?sort=deals" className="text-sm text-[#007185] hover:underline">
            See all deals
          </Link>
        </div>

        {loadingProducts ? (
          <p className="text-sm text-gray-600">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deals.map((product) => (
              <article key={product._id || product.id} className="border rounded-md p-3">
                <Link to={`/product/${product._id || product.id}`}>
                  <img src={product.images?.[0]} alt={product.name} className="w-full h-32 object-cover rounded" />
                  <h3 className="mt-2 text-sm font-medium line-clamp-2 min-h-10">{product.name}</h3>
                </Link>
                <div className="mt-2">
                  <p className="text-[#B12704] font-semibold">${Number(product.dealPrice).toFixed(2)}</p>
                  <p className="text-xs text-gray-500 line-through">${Number(product.price).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="mt-2 w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black text-sm py-1.5 rounded"
                >
                  Add to Cart
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Popular Products</h2>
          <Link to="/products" className="text-sm text-[#007185] hover:underline">
            Explore all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((product) => (
            <article key={product._id || product.id} className="border rounded-md p-3">
              <Link to={`/product/${product._id || product.id}`}>
                <img src={product.images?.[0]} alt={product.name} className="w-full h-36 object-cover rounded" />
                <h3 className="mt-2 text-sm font-medium line-clamp-2 min-h-10">{product.name}</h3>
              </Link>
              <p className="mt-1 font-semibold text-[#B12704]">${Number(product.price).toFixed(2)}</p>
              <button
                onClick={() => addToCart(product, 1)}
                className="mt-2 w-full bg-[#ffd814] hover:bg-[#f7ca00] text-black text-sm py-1.5 rounded"
              >
                Add to Cart
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
