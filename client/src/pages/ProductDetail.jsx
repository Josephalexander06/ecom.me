import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { products, addToCart } = useStore();

  const product = useMemo(
    () => products.find((item) => (item._id || item.id) === id),
    [products, id]
  );

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-[1000px] mx-auto px-4 py-10">
        <div className="bg-white border rounded-lg p-6">
          <h1 className="text-xl font-bold">Product not found</h1>
          <Link to="/products" className="text-[#007185] hover:underline text-sm mt-2 inline-block">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const isDeal = product.isDeal && product.dealPrice;
  const price = isDeal ? product.dealPrice : product.price;

  return (
    <div className="max-w-[1300px] mx-auto px-3 md:px-6 py-6">
      <div className="bg-white border rounded-lg p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-5">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-[360px] md:h-[460px] object-cover rounded border"
          />
        </section>

        <section className="lg:col-span-5">
          <p className="text-xs text-gray-500">Brand: {product.brand}</p>
          <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>

          <div className="mt-3 border-t border-b py-3">
            <p className="text-3xl text-[#B12704] font-semibold">${Number(price).toFixed(2)}</p>
            {isDeal && <p className="text-sm text-gray-500 line-through">${Number(product.price).toFixed(2)}</p>}
          </div>

          <p className="text-sm text-gray-700 mt-4 leading-relaxed">{product.description}</p>

          <ul className="mt-4 text-sm text-gray-700 list-disc pl-5 space-y-1">
            <li>Category: {product.category}</li>
            <li>In Stock: {product.stock}</li>
            <li>Sold: {product.soldCount || 0}</li>
            <li>Rating: {Number(product.averageRating || 4.2).toFixed(1)} / 5</li>
          </ul>
        </section>

        <aside className="lg:col-span-2 border rounded-lg p-4 h-fit">
          <p className="text-2xl text-[#B12704] font-semibold">${Number(price).toFixed(2)}</p>
          <p className="text-sm text-green-700 mt-1">In Stock</p>

          <label className="block mt-4 text-sm">Quantity</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 border rounded px-2 py-1 w-full"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <button
            onClick={() => addToCart(product, quantity)}
            className="w-full mt-4 bg-[#ffd814] hover:bg-[#f7ca00] text-black py-2 rounded-md text-sm"
          >
            Add to Cart
          </button>

          <Link
            to="/checkout"
            onClick={() => addToCart(product, quantity)}
            className="block w-full text-center mt-2 bg-[#ffa41c] hover:bg-[#fa8900] text-black py-2 rounded-md text-sm"
          >
            Buy Now
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetail;
