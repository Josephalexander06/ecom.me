import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const CartDrawer = ({ open, onClose }) => {
  const { cart, cartSubtotal, updateCartQuantity, removeFromCart } = useStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed top-0 right-0 h-full w-full max-w-md neo-panel z-50"
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-cyan-200/20 flex items-center justify-between">
                <h2 className="text-lg font-bold text-cyan-100">Shopping Cart</h2>
                <button onClick={onClose} className="p-1 hover:bg-cyan-300/10 rounded">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 && (
                  <p className="text-sm text-blue-100/70">Your cart is empty.</p>
                )}

                {cart.map((item) => (
                  <motion.div key={item.productId} layout className="border border-cyan-200/20 rounded-xl p-3 bg-[#0b1530]/70">
                    <div className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2 text-blue-50">{item.name}</p>
                        <p className="text-cyan-200 font-semibold mt-1">${item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-cyan-200/30 rounded bg-[#091022]">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-cyan-300/10"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-cyan-300/10"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-300 hover:text-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-cyan-200/20 p-4 space-y-3">
                <div className="flex justify-between font-semibold text-cyan-100">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full text-center neo-button py-2 rounded-lg"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
