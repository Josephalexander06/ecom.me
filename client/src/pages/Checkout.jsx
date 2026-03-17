import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Truck, CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/ui/PageWrapper';

const steps = [
  { id: 'shipping', title: 'Neural Location', icon: Truck },
  { id: 'payment', title: 'Credit Sync', icon: CreditCard },
  { id: 'review', title: 'System Review', icon: ShieldCheck }
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleFinalSync = async () => {
    setIsSyncing(true);
    
    // In a real app, we would get these from a Cart Context
    const mockOrderData = {
        items: [
            { productId: '65f1aeb4c9d2a3f123456781', name: 'Neural Link V4', price: 2499, quantity: 1 },
            { productId: '65f1aeb4c9d2a3f123456782', name: 'Retinal Iris Pro', price: 1899, quantity: 1 }
        ],
        totalAmount: 4398,
        userId: '65f1aeb4c9d2a3f123456789',
        paymentMethod: 'NeuralPay'
    };

    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockOrderData)
        });

        if (!response.ok) throw new Error('Neural transmission failed.');

        // Cinematic Artificial Delay to match backend sync
        setTimeout(() => {
            setIsSyncing(false);
            setIsCompleted(true);
        }, 3500);
    } catch (err) {
        console.error('Checkout Sync Error:', err);
        setIsSyncing(false);
        alert('Synaptic transmission failure. Please retry uplink.');
    }
  };

  if (isCompleted) {
      return (
          <PageWrapper>
              <div className="fixed inset-0 z-[300] bg-bg-deep flex flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-32 h-32 bg-accent-primary rounded-full flex items-center justify-center mb-10 shadow-[0_0_100px_var(--accent-primary)]"
                  >
                    <CheckCircle size={60} className="text-black" />
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-display text-5xl md:text-7xl text-text-main italic mb-6"
                  >
                    Transmission <br /> Successful.
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-text-muted font-mono text-xs uppercase tracking-[0.3em] mb-12"
                  >
                    Neural Packet ID: 0xFD-2040-AETHER
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Link to="/" className="px-12 py-5 rounded-2xl bg-white/5 border border-black/10 text-text-main font-display text-[10px] uppercase tracking-widest hover:bg-accent-primary hover:text-black transition-all">
                        Return to Uplink
                    </Link>
                  </motion.div>
                  {/* Background Ambient Light */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--accent-primary-transparent)_0%,transparent_70%)] pointer-events-none opacity-20" />
              </div>
          </PageWrapper>
      );
  }

  return (
    <PageWrapper>
      <div className="pt-24 md:pt-32 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto min-h-screen bg-bg-deep">
        {/* Syncing Overlay */}
        <AnimatePresence>
            {isSyncing && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[400] bg-white/90 backdrop-blur-3xl flex flex-col items-center justify-center px-10"
                >
                    <div className="w-full max-w-sm">
                        <div className="flex justify-between font-mono text-[10px] text-accent-primary uppercase tracking-[0.4em] mb-4">
                            <span>Syncing Consciousness</span>
                            <span>42%</span>
                        </div>
                        <div className="h-[2px] w-full bg-black/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 3.5 }}
                                className="h-full bg-accent-primary shadow-[0_0_20px_var(--accent-primary)]"
                            />
                        </div>
                    </div>
                    <motion.p 
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="mt-8 font-display text-sm text-black italic"
                    >
                        Please hold still while data packets are verified...
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-12">
          <Link to="/" className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors font-mono text-[10px] uppercase tracking-widest">
            <ChevronLeft size={16} /> Abort Sync
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-display text-text-main text-2xl italic hidden sm:block">Checkout Phase.</span>
          </div>
        </div>

        {/* Multi-step Indicator */}
        <div className="flex justify-between mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/5 -translate-y-1/2 z-0" />
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep >= idx;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isActive ? 'bg-accent-primary text-black shadow-[0_0_20px_var(--accent-primary)]' : 'bg-white border border-black/5 text-text-muted'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`font-mono text-[8px] md:text-[10px] uppercase tracking-widest ${isActive ? 'text-text-main' : 'text-text-muted'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-8 md:p-12 rounded-[3rem] border border-black/5"
              >
                {currentStep === 0 && (
                  <div className="space-y-8">
                    <h2 className="font-display text-3xl text-text-main italic mb-8">Neural Destination</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-text-muted px-2">Legal Identity</label>
                        <input className="w-full h-14 rounded-2xl bg-black/5 border border-black/5 px-6 focus:outline-none focus:border-accent-primary transition-colors text-text-main" placeholder="Full Name" />
                      </div>
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-text-muted px-2">Node Communication</label>
                        <input className="w-full h-14 rounded-2xl bg-black/5 border border-black/5 px-6 focus:outline-none focus:border-accent-primary transition-colors text-text-main" placeholder="Email Address" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-text-muted px-2">Physical Mesh Address</label>
                        <input className="w-full h-14 rounded-2xl bg-black/5 border border-black/5 px-6 focus:outline-none focus:border-accent-primary transition-colors text-text-main" placeholder="Street Address" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-8">
                    <h2 className="font-display text-3xl text-text-main italic mb-8">Credit Interface</h2>
                    <div className="space-y-6">
                      <div className="w-full aspect-[1.58/1] max-w-sm mx-auto glass rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br from-accent-primary/20 via-transparent to-accent-secondary/10 border border-black/5 mb-8">
                         <div className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 bg-accent-primary rounded-full opacity-50" />
                            <div className="w-6 h-6 bg-accent-secondary rounded-full absolute translate-x-3 opacity-50" />
                         </div>
                         <div className="mt-20">
                            <span className="font-mono text-sm tracking-[0.3em] text-text-main">XXXX XXXX XXXX 4022</span>
                         </div>
                         <div className="mt-8 flex justify-between items-end">
                            <span className="font-mono text-[10px] text-text-muted uppercase">Neuro-Debit</span>
                            <span className="font-mono text-xs text-text-main">11 / 28</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] uppercase tracking-widest text-text-muted px-2">Manual Interface</label>
                        <input className="w-full h-14 rounded-2xl bg-black/5 border border-black/5 px-6 focus:outline-none focus:border-accent-primary transition-colors text-text-main" placeholder="Card Number" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8 text-center py-8">
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                       <CheckCircle size={40} />
                    </div>
                    <h2 className="font-display text-4xl text-text-main italic mb-4">Neural Integrity Validated</h2>
                    <p className="text-text-muted max-w-md mx-auto mb-12">
                      Your synaptic order is ready for initialization. Once confirmed, the data stream will begin immediately.
                    </p>
                    <div className="glass p-8 rounded-3xl border border-black/5 text-left max-w-md mx-auto bg-white/50">
                       <div className="flex justify-between mb-4">
                          <span className="text-text-muted text-sm">Neural Units</span>
                          <span className="text-text-main font-mono text-sm">02</span>
                       </div>
                       <div className="flex justify-between border-t border-black/5 pt-4">
                          <span className="text-text-main font-bold">Total Credit Load</span>
                          <span className="text-accent-primary font-mono font-bold">$4,398</span>
                       </div>
                    </div>
                  </div>
                )}

                <div className="mt-12 flex items-center justify-between">
                  {currentStep > 0 && currentStep < 2 && (
                    <button onClick={prevStep} className="px-8 py-4 rounded-xl border border-black/10 text-text-main font-mono text-[10px] uppercase tracking-widest hover:bg-black/5 transition-colors">
                      Previous Phase
                    </button>
                  )}
                  <div className="flex-1" />
                  {currentStep < 2 ? (
                    <button onClick={nextStep} className="px-10 py-5 rounded-2xl bg-accent-primary text-black font-display font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-transform flex items-center gap-4 shadow-[0_20px_40px_rgba(16,206,209,0.3)]">
                      Execute Step
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleFinalSync}
                      className="w-full py-6 rounded-2xl bg-black text-white font-display font-bold uppercase tracking-widest text-[10px] hover:bg-accent-primary hover:text-black transition-all shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
                    >
                      Final Confirmation // Start Stream
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Checkout;
