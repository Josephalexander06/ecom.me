import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import { fetchSiteConfig, defaultSiteConfig } from '../utils/siteConfig';

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
  const { items, clearCart } = useCartStore();
  const { user, isAuthenticated, token, logout, updateProfile } = useAuthStore();
  const { setActiveModal } = useUIStore();
  const [siteConfig, setSiteConfig] = useState(defaultSiteConfig);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      setActiveModal('login');
    }
  }, [isAuthenticated, navigate, setActiveModal]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await fetchSiteConfig();
        setSiteConfig(config);
      } catch (err) {
        console.error('Failed to load site config:', err);
      }
    };
    loadConfig();
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  }, [items]);

  const threshold = siteConfig.freeShippingThreshold || 5000;
  const shippingCharge = siteConfig.defaultShippingCharge || 499;

  const shipping = subtotal >= threshold ? 0 : shippingCharge;
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(!user?.savedAddresses?.length);
  const { location } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.savedAddresses?.[0]?.street || '',
    city: user?.savedAddresses?.[0]?.city || location?.city || '',
    zip: user?.savedAddresses?.[0]?.zip || location?.pincode || '',
    paymentMethod: 'Card'
  });

  useEffect(() => {

    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        address: prev.address || user.savedAddresses?.[0]?.street || '',
        city: prev.city || user.savedAddresses?.[0]?.city || location?.city || '',
        zip: prev.zip || user.savedAddresses?.[0]?.zip || location?.pincode || ''
      }));
      if (user.savedAddresses?.length && !formData.address) {
        setIsManualEntry(false);
      }
    }
  }, [user, location]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const [processingState, setProcessingState] = useState(''); // 'verifying', 'allocating', 'securing'
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      handlePostStripeSuccess(sessionId);
    }
  }, [searchParams]);

  const handlePostStripeSuccess = async (sessionId) => {
    try {
      setProcessingState('verifying');
      const res = await fetch(`${API_BASE}/orders/verify-stripe-session/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.verified) {
        await finalizeOrder(sessionId);
        // Clear query params to prevent re-execution
        window.history.replaceState({}, document.title, "/checkout");
      }
    } catch (err) {
      console.error("Stripe Verification Error:", err);
    } finally {
      setProcessingState('');
    }
  };

  const handleStripePayment = async () => {
    try {
      setProcessingState('verifying');
      const response = await fetch(`${API_BASE}/orders/create-stripe-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || item.images?.[0]
          })),
          totalAmount: total
        })
      });

      const session = await response.json();
      if (!response.ok) throw new Error(session.message || 'Payment session failed');

      // Redirect to Stripe
      window.location.href = session.url;
    } catch (err) {
      alert("Payment Error: " + err.message);
    } finally {
      setProcessingState('');
    }
  };

  const finalizeOrder = async (paymentId = null) => {
    setIsPlacing(true);
    setProcessingState('allocating');

    try {
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
          paymentId: paymentId,
          shippingAddress: {
            street: formData.address,
            city: formData.city,
            zip: formData.zip
          }
        }),
      });

      if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Order creation failed');

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      alert('Order completion failed: ' + error.message);
    } finally {
      setIsPlacing(false);
      setProcessingState('');
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      setActiveModal('login');
      return;
    }

    if (formData.paymentMethod === 'COD') {
      await finalizeOrder();
    } else {
      await handleStripePayment();
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
    <div className="min-h-screen py-8 md:py-10">
      <div className="site-shell max-w-[1240px]">
        <StepIndicator currentStep={step} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Main Flow */}
          <main className="panel p-5 md:p-7 relative overflow-hidden">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-default">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-secondary flex items-center justify-center text-text-primary border border-border-default">
                      <MapPin size={18} />
                    </div>
                    <h2 className="text-body font-bold text-text-primary">Delivery Address</h2>
                  </div>
                  {user?.savedAddresses?.length > 0 && (
                     <button 
                       onClick={() => {
                         setIsManualEntry(!isManualEntry);
                         if (!isManualEntry) {
                           setFormData({ ...formData, address: '', city: location?.city || '', zip: location?.pincode || '' });
                         }
                       }} 
                       className="text-caption font-bold text-brand-primary hover:underline"
                     >
                       {isManualEntry ? 'Select Saved' : 'Add New'}
                     </button>
                  )}
                </div>

                {user?.savedAddresses?.length > 0 && !isManualEntry ? (
                  <div className="space-y-4">
                    <p className="text-caption font-bold text-text-muted uppercase tracking-wider">Select a saved address</p>
                    <div className="grid grid-cols-1 gap-3">
                      {user.savedAddresses.map((addr, idx) => (
                        <label 
                          key={idx}
                          className={`flex items-start gap-4 p-4 border rounded-md cursor-pointer transition-all ${
                            formData.address === addr.street ? 'border-brand-primary bg-brand-light/10 ring-1 ring-brand-primary' : 'border-border-default hover:border-text-muted bg-white'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name="address" 
                            checked={formData.address === addr.street}
                            onChange={() => setFormData({
                              ...formData,
                              address: addr.street,
                              city: addr.city,
                              zip: addr.zip
                            })}
                            className="mt-1 w-4 h-4 accent-brand-primary"
                          />
                          <div className="flex flex-col">
                            <span className="text-small font-bold text-text-primary">{user.name}</span>
                            <span className="text-small text-text-secondary mt-1">{addr.street}, {addr.city} - {addr.zip}</span>
                            <span className="text-[10px] font-bold text-success uppercase mt-2 tracking-tighter">Verified Address</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
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
                )}
                
                <div className="pt-6 mt-6 flex justify-end">
                  <button 
                    onClick={nextStep}
                    disabled={!formData.address || !formData.city || !formData.zip}
                    className="w-full md:w-auto bg-brand-primary text-white px-8 py-3 rounded-md font-bold hover:bg-brand-hover transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    Deliver to this Address <ChevronRight size={16} />
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
                  <button 
                    onClick={nextStep} 
                    className="w-full md:w-auto bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-hover transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
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
                    className="w-full md:w-auto bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-hover transition-colors flex items-center justify-center gap-2 group shadow-sm disabled:opacity-80"
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
            <div className="panel p-5 md:p-6">
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
