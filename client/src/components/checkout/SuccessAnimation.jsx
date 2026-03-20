import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

import { Printer, Download, MapPin, ReceiptText } from 'lucide-react';

const SuccessAnimation = ({ orderData }) => {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6">
      {/* Top Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="flex flex-row justify-center gap-3 mb-8 w-full max-w-2xl"
      >
        <a href="/orders" className="flex-1 bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-hover transition-all text-center text-[13px] shadow-sm flex items-center justify-center gap-2">
          Track Order
        </a>
        <a href="/" className="flex-1 bg-surface-secondary text-text-primary px-6 py-2.5 rounded-xl font-bold border border-border-default hover:bg-surface-tertiary transition-all text-center text-[13px]">
          Home
        </a>
      </motion.div>

      <div className="relative w-20 h-20 mb-4">
        <motion.svg
          viewBox="0 0 52 52"
          className="w-full h-full text-success"
        >
          <motion.circle
            cx="26"
            cy="26"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <motion.path
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          />
        </motion.svg>
      </div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-h2 font-display text-text-primary mb-2"
      >
        Order Confirmed!
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-[14px] text-text-secondary mb-6 text-center"
      >
        Thank you for shopping with ecom.me. Your order has been registered in the neural network.
      </motion.p>

      {orderData && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4 }}
          className="w-full max-w-2xl bg-white border border-border-default rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Invoice Header */}
          <div className="bg-brand-primary/5 p-6 border-b border-border-default flex justify-between items-center">
            <div>
              <p className="text-[11px] font-bold text-brand-primary uppercase tracking-widest mb-1">Receipt / Invoice</p>
              <h3 className="text-small font-bold text-text-primary">Order #{orderData.orderId?.slice(-8).toUpperCase()}</h3>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 text-[12px] font-bold text-brand-primary hover:bg-brand-primary/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Printer size={14} /> Print
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Delivery Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary">
                <MapPin size={16} />
                <span className="text-[13px] font-bold uppercase tracking-wider">Shipping Destination</span>
              </div>
              <div className="text-small text-text-secondary leading-relaxed pl-6 border-l-2 border-brand-primary/20">
                <p className="font-bold text-text-primary">{orderData.shippingAddress?.name || 'Customer'}</p>
                <p>{orderData.shippingAddress?.street}</p>
                <p>{orderData.shippingAddress?.city}, {orderData.shippingAddress?.zip}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand-primary">
                <ReceiptText size={16} />
                <span className="text-[13px] font-bold uppercase tracking-wider">Payment Activity</span>
              </div>
              <div className="bg-surface-secondary/50 p-4 rounded-xl border border-border-default space-y-2">
                <div className="flex justify-between text-small">
                  <span className="text-text-muted">Method</span>
                  <div className="text-right">
                    <span className="font-bold text-text-primary uppercase block">{orderData.paymentMethod}</span>
                    {orderData.cardDetails && (
                      <span className="text-[11px] text-text-muted mt-0.5 block italic">
                        {orderData.cardDetails.brand} **** {orderData.cardDetails.last4}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-small pt-2 border-t border-border-default/50">
                  <span className="text-text-muted text-h4">Total Paid</span>
                  <span className="font-bold text-brand-primary text-h4">₹{orderData.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-4 bg-surface-secondary/30 flex justify-center border-t border-border-default">
             <p className="text-[12px] text-text-muted italic">A copy of this digital receipt has been synched to your dashboard.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SuccessAnimation;
