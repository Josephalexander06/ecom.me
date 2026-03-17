import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Orders = () => {
  const { orders, loadOrders } = useStore();

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-3 md:px-6 py-6">
      <div className="bg-white border rounded-lg p-4 md:p-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="mt-4 text-sm text-gray-600">
            No orders yet. <Link to="/products" className="text-[#007185] hover:underline">Start shopping</Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <article key={order._id} className="border rounded-md p-4">
                <div className="flex flex-wrap gap-4 justify-between text-sm">
                  <p><span className="text-gray-500">Order ID:</span> {order._id}</p>
                  <p><span className="text-gray-500">Status:</span> {order.status || 'Order Placed'}</p>
                  <p><span className="text-gray-500">Total:</span> ${Number(order.totalAmount || 0).toFixed(2)}</p>
                </div>
                <div className="mt-3 space-y-2">
                  {(order.items || []).map((item) => (
                    <div key={`${order._id}-${item.productId}`} className="text-sm flex justify-between border-t pt-2">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${Number(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
