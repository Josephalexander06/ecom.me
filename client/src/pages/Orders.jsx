import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, LayoutGrid } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuthStore, useCartStore } from '../context/stores';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const OrderCard = ({ order, index }) => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { location } = useAuthStore();
  const [showTracking, setShowTracking] = useState(false);
  
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
    toast.success('Added to bag! Moving to checkout...');
    setTimeout(() => navigate('/cart'), 500);
  };

  const handleInvoice = () => {
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order._id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .details { margin: 40px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; border-bottom: 1px solid #eee; padding: 10px; }
            td { padding: 10px; border-bottom: 1px solid #f9f9f9; }
            .total { text-align: right; margin-top: 40px; font-size: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div><h1>INVOICE</h1><p>Order ID: ${order._id}</p></div>
            <div style="text-align: right;"><h2>ecom.me</h2><p>Mumbai, Maharashtra, India</p></div>
          </div>
          <div class="details">
            <div><strong>Bill To:</strong><p>${order.shippingAddress?.street}<br>${order.shippingAddress?.city} - ${order.shippingAddress?.zip}</p></div>
            <div><strong>Order Date:</strong><p>${new Date(order.createdAt).toLocaleDateString()}</p></div>
          </div>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toLocaleString()}</td>
                  <td>₹${(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total: ₹${order.totalAmount.toLocaleString()}</div>
          <p style="margin-top: 50px; text-align: center; color: #888;">Thank you for shopping with ecom.me!</p>
          <script>window.print();</script>
        </body>
      </html>
    `);
  };

  const trackingSteps = [
    { label: 'Ordered', icon: Package, key: 'pending' },
    { label: 'Confirmed', icon: CheckCircle2, key: 'confirmed' },
    { label: 'Packed', icon: LayoutGrid, key: 'packed' },
    { label: 'Shipped', icon: Truck, key: 'shipped' },
    { label: 'Delivered', icon: CheckCircle2, key: 'delivered' }
  ];

  const currentStepIndex = trackingSteps.findIndex(s => s.key === normalizedStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-border-default rounded-pro overflow-hidden mb-6 shadow-sm hover:shadow-md transition-shadow"
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
        <div className="flex items-start justify-between mb-8">
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
            onClick={() => setShowTracking(!showTracking)}
            className="bg-brand-primary text-white px-6 py-2 rounded-full text-caption font-bold hover:bg-brand-hover transition-all shadow-lg shadow-brand-primary/20"
          >
            {showTracking ? 'Close Tracking' : 'Track Package'}
          </button>
        </div>

        <AnimatePresence>
          {showTracking && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden bg-surface-secondary/50 rounded-xl p-6 border border-border-default"
            >
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-small font-bold text-text-primary">Logistics Timeline</h4>
                    <span className="text-[10px] font-mono text-text-muted bg-surface-tertiary px-2 py-1 rounded">Shipment ID: {order._id.slice(0, 8).toUpperCase()}</span>
                  </div>

                  <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border-default">
                    {trackingSteps.map((s, i) => {
                      const Icon = s.icon;
                      const isDone = i <= currentStepIndex;
                      const isCurrent = i === currentStepIndex;
                      
                      return (
                        <div key={s.label} className="relative pl-10 flex gap-4 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                          <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all z-10 ${
                            isDone 
                              ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/30' 
                              : 'bg-white border-border-default text-text-muted'
                          } ${isCurrent ? 'ring-4 ring-brand-light animate-pulse' : ''}`}>
                             <Icon size={14} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-small font-bold ${isDone ? 'text-text-primary' : 'text-text-muted'}`}>{s.label}</p>
                              {isDone && (
                                <p className="text-[10px] font-mono text-text-muted">
                                  {new Date(new Date(order.createdAt).getTime() + (i * 3600000 * 4)).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                </p>
                              )}
                            </div>
                            <p className="text-caption text-text-muted mt-0.5 leading-relaxed">
                              {s.key === 'pending' && 'Order successfully received and verified.'}
                              {s.key === 'confirmed' && 'Seller has acknowledged the order and started processing.'}
                              {s.key === 'packed' && 'Item has been carefully inspected and packed for shipping.'}
                              {s.key === 'shipped' && 'Handed over to our delivery partner. In transit to your city.'}
                              {s.key === 'delivered' && 'Package has been delivered to your doorstep. Enjoy!'}
                            </p>
                            {isCurrent && (
                               <div className="mt-4 p-3 bg-brand-light/20 border border-brand-primary/10 rounded-lg flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-brand-primary/20 shadow-sm">
                                     <Truck size={20} className="text-brand-primary" />
                                  </div>
                                  <div>
                                     <p className="text-[10px] font-black text-brand-primary uppercase">Current Status</p>
                                     <p className="text-small font-bold text-text-primary">Processing at our {location.city || 'Mumbai'} Hub</p>
                                  </div>
                               </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(order.items || []).map((item) => (
            <div key={item.productId} className="flex gap-4 items-center p-3 border border-border-default rounded-xl hover:border-brand-primary transition-colors bg-white shadow-sm group">
              <Link to={`/product/${item.productId}`} className="w-20 h-20 bg-surface-secondary rounded-lg border border-border-default overflow-hidden flex-shrink-0 group-hover:opacity-80 transition-opacity">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${item.productId}`} className="text-caption font-bold text-text-primary line-clamp-1 hover:text-brand-primary transition-colors">
                  {item.name}
                </Link>
                <p className="text-caption text-text-muted mt-1 font-mono">₹{item.price.toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-text-muted font-bold">Qty: {item.quantity}</p>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleBuyAgain(item);
                  }}
                  className="mt-2 text-[10px] font-bold text-brand-primary py-1 px-3 border border-brand-primary/20 rounded-lg hover:bg-brand-primary hover:text-white transition-all"
                >
                   Buy Again
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
