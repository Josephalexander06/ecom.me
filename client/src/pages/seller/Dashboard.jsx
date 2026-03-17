import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const Dashboard = () => {
  const { products, orders } = useStore();

  const sellerStats = useMemo(() => {
    const listedProducts = products.length;
    const lowStock = products.filter((product) => Number(product.stock || 0) < 10).length;
    const totalUnitsSold = products.reduce((sum, product) => sum + Number(product.soldCount || 0), 0);
    const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    return [
      { label: 'Listed Products', value: listedProducts },
      { label: 'Low Stock Alerts', value: lowStock },
      { label: 'Units Sold', value: totalUnitsSold },
      { label: 'Revenue', value: `$${revenue.toFixed(2)}` }
    ];
  }, [products, orders]);

  return (
    <div className="max-w-[1200px] mx-auto px-3 md:px-6 py-6 space-y-4">
      <div className="bg-white border rounded-lg p-4 md:p-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Track catalog, stock, and performance.</p>
          </div>
          <Link to="/seller/add-product" className="bg-[#131921] text-white px-3 py-2 text-sm rounded">
            Add New Product
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {sellerStats.map((stat) => (
            <div key={stat.label} className="border rounded-md p-3">
              <p className="text-xs text-gray-600">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 md:p-6">
        <h2 className="font-bold text-lg mb-3">Product Inventory</h2>
        <div className="space-y-2">
          {products.slice(0, 12).map((product) => (
            <div key={product._id || product.id} className="border rounded p-3 text-sm flex flex-wrap justify-between gap-2">
              <span>{product.name}</span>
              <span>Stock: {Number(product.stock || 0)}</span>
              <span className="text-[#B12704]">${Number(product.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
