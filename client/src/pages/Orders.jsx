import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuthStore, useCartStore } from '../context/stores';
import EmptyState from '../components/ui/EmptyState';

const OrderCard = ({ order, index }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  
  const statusColors = {
    pending: 'bg-brand-light text-brand-primary',
    confirmed: 'bg-brand-secondary/20 text-brand-primary',
    packed: 'bg-warning-light text-warning',
    shipped: 'bg-success-light text-success',
    delivered: 'bg-success-light text-success',
  };

  const normalizedStatus = (order.status || 'pending').toLowerCase();
  const label = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);

  const handleBuyAgain = (item) => {
    addItem({
      _id: item.productId,
      name: item.name,
      price: item.price,
      images: [item.image]
    }, item.quantity);
    navigate('/cart');
  };

  const handleInvoice = () => {
    alert(`Generating invoice for Order #${order._id.slice(-6).toUpperCase()}...\n\nItems: ${order.items.length}\nTotal: ₹${order.totalAmount.toLocaleString('en-IN')}\n\nThis would normally open a PDF or a printable window.`);
  };

  const handleTrackPackage = () => {
    const trackingSteps = [
      { step: 'Ordered', done: true },
      { step: 'Confirmed', done: ['confirmed', 'packed', 'shipped', 'delivered'].includes(normalizedStatus) },
      { step: 'Packed', done: ['packed', 'shipped', 'delivered'].includes(normalizedStatus) },
      { step: 'Shipped', done: ['shipped', 'delivered'].includes(normalizedStatus) },
      { step: 'Delivered', done: normalizedStatus === 'delivered' }
    ];
    
    alert(`Tracking for #${order._id.slice(-6).toUpperCase()}:\n\n` + 
      trackingSteps.map(s => `${s.done ? '✅' : '⚪'} ${s.step}`).join('\n')
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-border-default rounded-pro overflow-hidden mb-6"
    >
      <div className="bg-surface-secondary px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border-default">
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Order Placed</p>
            <p className="text-small font-bold text-text-primary">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total</p>
            <p className="text-small font-bold text-text-primary">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Ship To</p>
            <p className="text-small font-bold text-brand-primary cursor-pointer hover:underline">{order.shippingAddress?.city || 'Default'}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Order # {order._id.slice(-12).toUpperCase()}</p>
          <div className="flex items-center gap-2 mt-0.5 justify-end">
             <button onClick={handleInvoice} className="text-caption font-bold text-brand-primary hover:underline">View invoice</button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 ${statusColors[normalizedStatus] || 'bg-brand-light text-brand-primary'}`}>
                {normalizedStatus === 'shipped' || normalizedStatus === 'delivered' ? <Truck size={12} /> : <Clock size={12} />}
                {label}
             </div>
             <p className="text-small font-bold text-text-primary">
               {normalizedStatus === 'delivered' ? 'Delivered successfully' : 'Arriving in 3-5 days'}
             </p>
          </div>
          <button 
            onClick={handleTrackPackage}
            className="bg-brand-primary text-white px-4 py-2 rounded-lg text-caption font-bold hover:bg-brand-hover transition-colors shadow-sm"
          >
            Track Package
          </button>
        </div>

        <div className="space-y-4">
          {(order.items || []).map((item) => (
            <div key={item.productId} className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-surface-secondary rounded-lg border border-border-default overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-small font-bold text-text-primary line-clamp-1">{item.name}</p>
                <p className="text-caption text-text-muted mt-1 uppercase tracking-tighter">Amount: ₹{item.price.toLocaleString('en-IN')}</p>
                <p className="text-caption text-text-muted">Quantity: {item.quantity}</p>
                <button 
                  onClick={() => handleBuyAgain(item)}
                  className="mt-2 text-caption font-bold text-brand-primary py-1.5 px-3 border border-border-default rounded-lg hover:bg-surface-secondary transition-colors"
                >
                   Buy it again
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Orders = () => {
  const { orders, loadOrders } = useStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      loadOrders(user._id || user.id);
    }
  }, [loadOrders, user]);

  return (
    <div className="bg-surface-primary min-h-screen py-12">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        <h1 className="text-h2 font-display text-text-primary mb-8 underline decoration-brand-primary decoration-4 underline-offset-8">
          Your Orders
        </h1>

        {orders.length === 0 ? (
          <EmptyState 
            type="orders" 
            actionLabel="Return to Shop" 
            actionLink="/products" 
          />
        ) : (
          <div className="space-y-2">
            {orders.map((order, index) => (
              <OrderCard key={order._id} order={order} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
