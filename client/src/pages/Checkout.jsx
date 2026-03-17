import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Truck,
  CheckCircle2,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useCartStore, useAuthStore } from '../context/stores';
import SuccessAnimation from '../components/checkout/SuccessAnimation';

const StepIndicator = ({ currentStep }) => {
  const steps = ['Address', 'Payment', 'Review'];
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold transition-colors ${
              i + 1 <= currentStep ? 'bg-brand-primary text-white' : 'bg-surface-secondary text-text-muted border border-border-default'
            }`}>
              {i + 1 < currentStep ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span className={`text-small font-bold ${i + 1 <= currentStep ? 'text-text-primary' : 'text-text-muted'}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && <div className="w-12 h-[1px] bg-border-default" />}
        </React.Fragment>
      ))}
    </div>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.savedAddresses?.[0]?.street || '',
    city: user?.savedAddresses?.[0]?.city || '',
    zip: user?.savedAddresses?.[0]?.zip || '',
    paymentMethod: 'Card'
  });

  const FREE_SHIPPING_THRESHOLD = 5000;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    // Simulate API call
    setTimeout(() => {
      setIsPlacing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20">
        <SuccessAnimation />
        <div className="flex justify-center gap-4 mt-8">
          <Link to="/orders" className="bg-brand-primary text-white px-8 py-3 rounded-pill font-bold hover:bg-brand-hover transition-all">
            View My Orders
          </Link>
          <Link to="/" className="bg-surface-secondary text-text-primary px-8 py-3 rounded-pill font-bold hover:bg-surface-tertiary transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <h2 className="text-h2 font-display mb-4">No items to checkout</h2>
        <Link to="/products" className="text-brand-primary font-bold hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-primary min-h-screen py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* Main Flow */}
          <main className="bg-white border border-border-default rounded-pro p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <MapPin className="text-brand-primary" size={24} />
                    <h2 className="text-h3 font-display">Shipping Address</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col col-span-2">
                       <label className="text-caption font-bold text-text-secondary">Full Name</label>
                       <input 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                       />
                    </div>
                    <div className="space-y-1.5 flex flex-col col-span-2">
                       <label className="text-caption font-bold text-text-secondary">Street Address</label>
                       <input 
                         type="text" 
                         value={formData.address}
                         onChange={(e) => setFormData({...formData, address: e.target.value})}
                         className="bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                       />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                       <label className="text-caption font-bold text-text-secondary">City / Region</label>
                       <input 
                         type="text" 
                         value={formData.city}
                         onChange={(e) => setFormData({...formData, city: e.target.value})}
                         className="bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                       />
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                       <label className="text-caption font-bold text-text-secondary">ZIP / Postal Code</label>
                       <input 
                         type="text" 
                         value={formData.zip}
                         onChange={(e) => setFormData({...formData, zip: e.target.value})}
                         className="bg-surface-secondary border border-border-default rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                       />
                    </div>
                  </div>
                  
                  <button 
                    onClick={nextStep}
                    className="mt-8 bg-brand-primary text-white px-10 py-3 rounded-pill font-bold hover:bg-brand-hover transition-all flex items-center gap-2 float-right"
                  >
                    Continue to Payment <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <CreditCard className="text-brand-primary" size={24} />
                    <h2 className="text-h3 font-display">Payment Method</h2>
                  </div>

                  <div className="space-y-4">
                    {['Card', 'UPI', 'COD'].map(method => (
                      <label 
                        key={method}
                        className={`flex items-center justify-between p-4 border rounded-pro cursor-pointer transition-all ${
                          formData.paymentMethod === method ? 'border-brand-primary bg-brand-light/20 ring-1 ring-brand-primary' : 'border-border-default hover:border-brand-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name="payment" 
                            className="w-4 h-4 accent-brand-primary"
                            checked={formData.paymentMethod === method}
                            onChange={() => setFormData({...formData, paymentMethod: method})}
                          />
                          <span className="text-body font-bold text-text-primary">
                            {method === 'Card' ? 'Credit / Debit Card' : method === 'UPI' ? 'UPI (Instant Connect)' : 'Cash on Delivery'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                           {method === 'Card' && <div className="h-4 w-6 bg-surface-tertiary rounded" />}
                           {method === 'UPI' && <div className="h-4 w-8 bg-brand-primary rounded" />}
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-12 pt-8 border-t border-border-default">
                    <button onClick={prevStep} className="flex items-center gap-2 text-small font-bold text-text-secondary hover:text-text-primary transition-colors">
                      <ArrowLeft size={18} /> Back to Address
                    </button>
                    <button onClick={nextStep} className="bg-brand-primary text-white px-10 py-3 rounded-pill font-bold hover:bg-brand-hover transition-all flex items-center gap-2">
                      Review Order <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <ShieldCheck className="text-brand-primary" size={24} />
                    <h2 className="text-h3 font-display">Order Review</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-4 bg-surface-secondary rounded-pro">
                      <p className="text-caption font-bold text-text-muted uppercase mb-2">Shipping to</p>
                      <p className="text-small font-bold text-text-primary">{formData.name}</p>
                      <p className="text-small text-text-secondary">{formData.address}</p>
                      <p className="text-small text-text-secondary">{formData.city}, {formData.zip}</p>
                      <button onClick={() => setStep(1)} className="text-caption font-bold text-brand-primary hover:underline mt-2">Edit</button>
                    </div>
                    <div className="p-4 bg-surface-secondary rounded-pro">
                      <p className="text-caption font-bold text-text-muted uppercase mb-2">Payment</p>
                      <p className="text-small font-bold text-text-primary">{formData.paymentMethod}</p>
                      <p className="text-small text-text-secondary">Matrix Encrypted</p>
                      <button onClick={() => setStep(2)} className="text-caption font-bold text-brand-primary hover:underline mt-2">Edit</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-caption font-bold text-text-muted uppercase tracking-widest">Bag Contents</p>
                     {items.map(item => (
                       <div key={item.productId} className="flex justify-between items-center py-2 border-b border-border-default last:border-0">
                         <span className="text-small text-text-primary"><span className="font-bold">{item.quantity}x</span> {item.name}</span>
                         <span className="text-small font-mono font-bold text-text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                       </div>
                     ))}
                  </div>

                  <div className="flex items-center justify-between mt-12 pt-8 border-t border-border-default">
                    <button onClick={prevStep} className="flex items-center gap-2 text-small font-bold text-text-secondary hover:text-text-primary transition-colors">
                      <ArrowLeft size={18} /> Back to Payment
                    </button>
                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isPlacing}
                      className="bg-brand-primary text-white px-12 py-4 rounded-pill font-bold hover:bg-brand-hover transition-all flex items-center gap-2 group relative overflow-hidden"
                    >
                      {isPlacing ? 'Encrypting Order...' : 'Confirm & Place Order'}
                      {!isPlacing && <Lock size={18} className="transition-transform group-hover:scale-110" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Sidebar Summary */}
          <aside>
            <div className="bg-white border border-border-default rounded-pro p-8 sticky top-[150px] shadow-sm">
              <h2 className="text-body font-bold text-text-primary mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Items</span>
                  <span className="font-mono text-text-primary font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Shipping</span>
                  {shipping === 0 ? <span className="text-success font-bold">FREE</span> : <span className="font-mono text-text-primary font-bold">${shipping.toFixed(2)}</span>}
                </div>
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Estimated Tax</span>
                  <span className="font-mono text-text-primary font-bold">${tax.toFixed(2)}</span>
                </div>
                <div className="h-[1px] bg-border-default my-2" />
                <div className="flex justify-between text-body font-bold text-text-primary">
                  <span>Order Total</span>
                  <span className="text-h3 font-mono font-bold text-brand-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border-default">
                <div className="flex gap-3 text-caption text-text-muted leading-tight">
                  <Truck size={18} className="text-brand-primary flex-shrink-0" />
                  <span>Estimated Arrival: <span className="text-text-primary font-bold">Tuesday, March 23</span></span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
