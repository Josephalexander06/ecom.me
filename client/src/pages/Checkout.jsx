import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, cartSubtotal, placeOrder } = useStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'Card'
  });

  const total = useMemo(() => Number(cartSubtotal.toFixed(2)), [cartSubtotal]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!cart.length) return;

    setIsSubmitting(true);
    try {
      await placeOrder({
        paymentMethod: form.paymentMethod,
        shippingAddress: `${form.address}, ${form.city}, ${form.state}, ${form.zip}`
      });
      navigate('/orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="max-w-[1000px] mx-auto px-4 py-10">
        <div className="bg-white border rounded-lg p-6">
          <h1 className="text-xl font-bold">Your cart is empty</h1>
          <p className="text-sm text-gray-600 mt-2">Add products before checking out.</p>
          <Link to="/products" className="text-[#007185] hover:underline text-sm mt-3 inline-block">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-3 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form onSubmit={onSubmit} className="lg:col-span-8 bg-white border rounded-lg p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="fullName" value={form.fullName} onChange={onChange} placeholder="Full name" className="border rounded px-3 py-2" required />
          <input name="address" value={form.address} onChange={onChange} placeholder="Street address" className="border rounded px-3 py-2" required />
          <input name="city" value={form.city} onChange={onChange} placeholder="City" className="border rounded px-3 py-2" required />
          <input name="state" value={form.state} onChange={onChange} placeholder="State" className="border rounded px-3 py-2" required />
          <input name="zip" value={form.zip} onChange={onChange} placeholder="ZIP code" className="border rounded px-3 py-2" required />

          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={onChange}
            className="border rounded px-3 py-2"
          >
            <option value="Card">Credit/Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="COD">Cash on Delivery</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 bg-[#ffd814] hover:bg-[#f7ca00] disabled:opacity-60 text-black px-6 py-2 rounded-md font-medium"
        >
          {isSubmitting ? 'Placing Order...' : 'Place your order'}
        </button>
      </form>

      <aside className="lg:col-span-4 bg-white border rounded-lg p-4 h-fit">
        <h2 className="text-lg font-bold">Order Summary</h2>

        <div className="mt-3 space-y-3 max-h-80 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.productId} className="text-sm border-b pb-2">
              <p className="font-medium line-clamp-2">{item.name}</p>
              <p className="text-gray-600">Qty: {item.quantity}</p>
              <p className="text-[#B12704]">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;
