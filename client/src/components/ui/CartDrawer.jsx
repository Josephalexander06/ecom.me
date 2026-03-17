import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const CartDrawer = ({ open, onClose }) => {
  const { cart, cartSubtotal, updateCartQuantity, removeFromCart } = useStore();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold">Shopping Cart</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 && (
              <p className="text-sm text-gray-600">Your cart is empty.</p>
            )}

            {cart.map((item) => (
              <div key={item.productId} className="border rounded-md p-3">
                <div className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                    <p className="text-[#B12704] font-semibold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center border rounded">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>${cartSubtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-[#ffd814] hover:bg-[#f7ca00] text-black py-2 rounded-md font-medium"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
