import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const AdminDashboard = () => {
  const { products, orders, isUsingFallback, refreshProducts } = useStore();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const totalSales = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const totalOrders = orders.length;

    return [
      { label: 'Total Products', value: totalProducts },
      { label: 'Total Stock', value: totalStock },
      { label: 'Total Orders', value: totalOrders },
      { label: 'Sales Volume', value: `$${totalSales.toFixed(2)}` }
    ];
  }, [products, orders]);

  return (
    <div className="max-w-[1200px] mx-auto px-3 md:px-6 py-6 space-y-4">
      <div className="bg-white border rounded-lg p-4 md:p-6">
        <div className="flex flex-wrap justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Monitor storefront performance and inventory.
              {isUsingFallback ? ' Running in fallback mode.' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={refreshProducts} className="border px-3 py-2 text-sm rounded hover:bg-gray-50">
              Refresh data
            </button>
            <Link to="/seller/add-product" className="bg-[#131921] text-white px-3 py-2 text-sm rounded">
              Add product
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {stats.map((stat) => (
            <div key={stat.label} className="border rounded-md p-3">
              <p className="text-xs text-gray-600">{stat.label}</p>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4 md:p-6">
        <h2 className="font-bold text-lg mb-3">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-gray-600">No orders available yet.</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 8).map((order) => (
              <div key={order._id} className="border rounded p-3 text-sm flex flex-wrap justify-between gap-2">
                <span>#{order._id}</span>
                <span>{order.status || 'Order Placed'}</span>
                <span>${Number(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
