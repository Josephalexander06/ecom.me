import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useCartStore, useAuthStore, useUIStore } from '../context/stores';
import SuccessAnimation from '../components/checkout/SuccessAnimation';
import { API_BASE } from '../utils/api';

const StepIndicator = ({ currentStep }) => {
  const steps = ['Address', 'Payment', 'Review'];
  return (
    <div className="flex items-center justify-center gap-4 mb-10">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-caption font-bold transition-colors ${
              i + 1 <= currentStep ? 'bg-brand-primary text-white' : 'bg-surface-secondary text-text-muted border border-border-default'
            }`}>
              {i + 1 < currentStep ? <CheckCircle2 size={14} /> : i + 1}
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
  const { user, isAuthenticated, token } = useAuthStore();
  const { setActiveModal } = useUIStore();
  
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.savedAddresses?.[0]?.street || '',
    city: user?.savedAddresses?.[0]?.city || 'Mumbai',
    zip: user?.savedAddresses?.[0]?.zip || '400001',
    paymentMethod: 'Card'
  });

  const FREE_SHIPPING_THRESHOLD = 5000;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const [processingState, setProcessingState] = useState(''); // 'verifying', 'allocating', 'securing'

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      setActiveModal('login');
      return;
    }

    setIsPlacing(true);
    
    try {
      // Setup Gateway Simulation
      setProcessingState('verifying');
      await new Promise(r => setTimeout(r, 600)); // Faster simulation
      
      setProcessingState('allocating');
      await new Promise(r => setTimeout(r, 800)); // Faster simulation
      
      setProcessingState('securing');
      
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId || item._id || item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image || item.images?.[0]
          })),
          totalAmount: total,
          paymentMethod: formData.paymentMethod,
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            zip: formData.zip
          }
        }),
      });

      if (!response.ok) throw new Error('Order Transmission Failed');

      await new Promise(r => setTimeout(r, 400)); // Faster simulaton
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error('Order Sync Error:', error);
      alert('Transaction Failed: ' + error.message);
    } finally {
      setIsPlacing(false);
      setProcessingState('');
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-[800px] mx-auto px-4 py-20">
        <SuccessAnimation />
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <Link to="/orders" className="bg-brand-primary text-white px-10 py-3.5 rounded-pro font-bold hover:bg-brand-hover transition-all text-center shadow-sm">
            Track My Order
          </Link>
          <Link to="/" className="bg-surface-secondary text-text-primary px-10 py-3.5 rounded-pro font-bold border border-border-default hover:bg-surface-tertiary transition-all text-center">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 text-center">
        <h2 className="text-h2 font-display mb-4">Your bag is empty</h2>
        <Link to="/products" className="bg-brand-primary text-white px-8 py-3 rounded-pro font-bold hover:bg-brand-hover transition-all inline-block">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary min-h-screen py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Main Flow */}
          <main className="bg-white border border-border-default rounded-pro p-6 md:p-8 relative overflow-hidden shadow-sm">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-default">
                  <div className="w-8 h-8 rounded bg-surface-secondary flex items-center justify-center text-text-primary border border-border-default">
                    <MapPin size={18} />
                  </div>
                  <h2 className="text-body font-bold text-text-primary">Delivery Address</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col md:col-span-2">
                     <label className="text-[13px] font-bold text-text-secondary">Full Name</label>
                     <input 
                       type="text" 
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       placeholder="Enter your full name"
                       className="bg-white border border-border-default rounded-md px-4 py-2.5 text-small focus:outline-none focus:border-brand-primary transition-colors hover:border-text-muted"
                     />
                  </div>
                  <div className="space-y-1.5 flex flex-col md:col-span-2">
                     <label className="text-[13px] font-bold text-text-secondary">Street Address</label>
                     <input 
                       type="text" 
                       value={formData.address}
                       onChange={(e) => setFormData({...formData, address: e.target.value})}
                       placeholder="House No, Building, Street, Area"
                       className="bg-white border border-border-default rounded-md px-4 py-2.5 text-small focus:outline-none focus:border-brand-primary transition-colors hover:border-text-muted"
                     />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                     <label className="text-[13px] font-bold text-text-secondary">City</label>
                     <input 
                       type="text" 
                       value={formData.city}
                       onChange={(e) => setFormData({...formData, city: e.target.value})}
                       placeholder="City"
                       className="bg-white border border-border-default rounded-md px-4 py-2.5 text-small focus:outline-none focus:border-brand-primary transition-colors hover:border-text-muted"
                     />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                     <label className="text-[13px] font-bold text-text-secondary">Pincode</label>
                     <input 
                       type="text" 
                       value={formData.zip}
                       onChange={(e) => setFormData({...formData, zip: e.target.value})}
                       placeholder="6-digit Pincode"
                       className="bg-white border border-border-default rounded-md px-4 py-2.5 text-small focus:outline-none focus:border-brand-primary transition-colors hover:border-text-muted"
                     />
                  </div>
                </div>
                
                <div className="pt-6 mt-6 flex justify-end">
                  <button 
                    onClick={nextStep}
                    className="w-full md:w-auto bg-brand-primary text-white px-8 py-3 rounded-md font-bold hover:bg-brand-hover transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    Save & Continue <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-default">
                  <div className="w-8 h-8 rounded bg-surface-secondary flex items-center justify-center text-text-primary border border-border-default">
                    <CreditCard size={18} />
                  </div>
                  <h2 className="text-body font-bold text-text-primary">Payment Options</h2>
                </div>

                <div className="space-y-3">
                  {['Card', 'UPI', 'COD'].map(method => (
                    <label 
                      key={method}
                      className={`flex items-center justify-between p-4 border rounded-md cursor-pointer transition-all ${
                        formData.paymentMethod === method ? 'border-brand-primary bg-brand-light/10 ring-1 ring-brand-primary' : 'border-border-default hover:border-text-muted bg-white'
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
                        <div className="flex flex-col">
                          <span className="text-small font-bold text-text-primary">
                            {method === 'Card' ? 'Credit / Debit Card' : method === 'UPI' ? 'UPI (Google Pay, PhonePe)' : 'Cash on Delivery'}
                          </span>
                          <span className="text-[12px] text-text-muted">
                            {method === 'Card' ? 'Visa, Mastercard, RuPay' : method === 'UPI' ? 'Instant payment via App' : 'Pay when you receive items'}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-6 border-t border-border-default gap-4">
                  <button onClick={prevStep} className="flex items-center gap-1.5 text-small font-bold text-text-secondary hover:text-text-primary transition-colors">
                    <ArrowLeft size={16} /> Delivery Details
                  </button>
                  <button onClick={nextStep} className="w-full md:w-auto bg-brand-primary text-white px-8 py-3 rounded-md font-bold hover:bg-brand-hover transition-all flex items-center justify-center gap-2 shadow-sm">
                    Summary <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-default">
                  <div className="w-8 h-8 rounded bg-surface-secondary flex items-center justify-center text-text-primary border border-border-default">
                    <ShieldCheck size={18} />
                  </div>
                  <h2 className="text-body font-bold text-text-primary">Review Order</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-secondary/50 rounded-md border border-border-default">
                    <p className="text-[11px] font-bold text-text-muted uppercase mb-2 tracking-wider">Delivering to</p>
                    <p className="text-small font-bold text-text-primary">{formData.name}</p>
                    <p className="text-small text-text-secondary mt-0.5">{formData.address}, {formData.city} - {formData.zip}</p>
                    <button onClick={() => setStep(1)} className="text-[13px] font-bold text-brand-primary hover:underline mt-2 inline-block">Edit</button>
                  </div>
                  <div className="p-4 bg-surface-secondary/50 rounded-md border border-border-default">
                    <p className="text-[11px] font-bold text-text-muted uppercase mb-2 tracking-wider">Payment via</p>
                    <p className="text-small font-bold text-text-primary">{formData.paymentMethod}</p>
                    <button onClick={() => setStep(2)} className="text-[13px] font-bold text-brand-primary hover:underline mt-2 inline-block">Edit</button>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                   <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Cart Verification</p>
                   {items.map(item => (
                     <div key={item.productId} className="flex justify-between items-center py-2 border-b border-border-default last:border-0">
                       <div className="flex flex-col">
                         <span className="text-small font-bold text-text-primary line-clamp-1">{item.name}</span>
                         <span className="text-[12px] text-text-muted mt-0.5">Qty: {item.quantity}</span>
                       </div>
                       <span className="text-small font-mono font-bold text-text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                     </div>
                   ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between mt-8 pt-6 border-t border-border-default gap-4">
                  <button onClick={prevStep} className="flex items-center gap-1.5 text-small font-bold text-text-secondary hover:text-text-primary transition-colors">
                    <ArrowLeft size={16} /> Payment Options
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="w-full md:w-auto bg-brand-primary text-white px-8 py-3 rounded-md font-bold hover:bg-brand-hover transition-all flex items-center justify-center gap-2 group shadow-sm disabled:opacity-80"
                  >
                    {isPlacing ? (
                      <div className="flex items-center gap-2">
                        <Lock size={16} className="animate-pulse" />
                        <span className="text-[13px]">
                          {processingState === 'verifying' && 'Verifying...'}
                          {processingState === 'allocating' && 'Allocating...'}
                          {processingState === 'securing' && 'Processing...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        Complete Purchase
                        <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Sidebar Summary */}
          <aside className="sticky top-[100px]">
            <div className="bg-white border border-border-default rounded-pro p-6 shadow-sm">
              <h2 className="text-body font-bold text-text-primary mb-5">Price Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Items ({items.length})</span>
                  <span className="font-mono text-text-primary font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Shipping</span>
                  {shipping === 0 ? <span className="text-success font-bold text-[12px] uppercase">Free</span> : <span className="font-mono text-text-primary font-bold">₹{shipping}</span>}
                </div>
                <div className="flex justify-between text-small text-text-secondary">
                  <span>Taxes (18%)</span>
                  <span className="font-mono text-text-primary font-bold">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-[1px] bg-border-default my-3" />
                <div className="flex justify-between text-small font-bold text-text-primary items-center">
                  <span>Total Payable</span>
                  <span className="text-h3 font-mono font-bold text-brand-primary">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
            </div>
            <div className="mt-4 flex gap-3 text-[11px] text-text-muted leading-relaxed px-2 items-start">
              <ShieldCheck size={16} className="text-brand-primary flex-shrink-0 mt-0.5" />
              <p>Safe and secure payments. 100% Authentic products guarantees.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
