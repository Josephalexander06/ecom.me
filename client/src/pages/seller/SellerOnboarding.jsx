import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Building2, CreditCard, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../context/stores';
import toast from 'react-hot-toast';

const SellerOnboarding = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, upgradeUser } = useAuthStore();
  const { setActiveModal } = useUIStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    bankAccount: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    setIsSubmitting(true);
    try {
      await upgradeUser(user._id || user.id, formData.storeName, formData.bankAccount);
      toast.success('Welcome to ecom.me Seller Central!');
      navigate('/seller/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to upgrade account');
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] bg-surface-secondary flex items-center justify-center p-4">
        <div className="max-w-[500px] bg-white rounded-pro shadow-sm border border-border-default p-10 text-center">
          <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-6">
            <Store size={32} />
          </div>
          <h1 className="text-h3 font-display mb-3">Join as a Seller</h1>
          <p className="text-small text-text-secondary mb-8">
            You must be signed in to upgrade your account and start selling to millions of customers.
          </p>
          <button 
            onClick={() => setActiveModal('login')}
            className="bg-brand-primary text-white px-8 py-3.5 rounded-pro font-bold hover:bg-brand-hover transition-all inline-flex items-center gap-2 shadow-sm"
          >
            Sign In or Register <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary min-h-screen py-12">
      <div className="max-w-[700px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-10">
          <h1 className="text-h2 font-display mb-2">Setup Your Store</h1>
          <p className="text-body text-text-secondary">Complete your business profile to start receiving orders.</p>
        </div>

        <main className="bg-white border border-border-default rounded-pro shadow-sm overflow-hidden">
          <div className="p-8 md:p-10 border-b border-border-default bg-surface-primary flex items-center gap-4">
            <div className="w-12 h-12 bg-surface-secondary rounded-full flex items-center justify-center text-text-primary border border-border-default">
              <span className="font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-small font-bold text-text-primary">Signed in as {user.name}</p>
              <p className="text-[13px] text-text-muted">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
            
            <div className="space-y-6">
              <h3 className="text-body font-bold text-text-primary flex items-center gap-2 border-b border-border-default pb-3">
                <Building2 size={18} className="text-brand-primary" /> Store Information
              </h3>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-text-secondary">Public Store Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Matrix Tech Solutions"
                  className="w-full bg-white border border-border-default rounded-md px-4 py-3 text-small focus:outline-none focus:border-brand-primary transition-colors hover:border-text-muted"
                  value={formData.storeName}
                  onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                />
                <p className="text-[11px] text-text-muted mt-1">This is how your store will appear to customers.</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-body font-bold text-text-primary flex items-center gap-2 border-b border-border-default pb-3">
                <CreditCard size={18} className="text-brand-primary" /> Payment Details
              </h3>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-text-secondary">Bank Account Number</label>
                <input 
                  type="text" 
                  required
                  placeholder="Any dummy number (e.g. 123456789)"
                  className="w-full bg-white border border-border-default rounded-md px-4 py-3 text-small font-mono focus:outline-none focus:border-brand-primary transition-colors hover:border-text-muted"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({...formData, bankAccount: e.target.value})}
                />
                <p className="text-[11px] text-text-muted flex items-center gap-1 mt-1">
                  <ShieldCheck size={12} className="text-success" /> Encrypted and stored securely.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border-default flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-text-muted max-w-[300px] leading-relaxed">
                By clicking Submit, you agree to the ecom.me Seller Terms and Revenue Share policies.
              </p>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-brand-primary text-white px-10 py-3.5 rounded-md font-bold hover:bg-brand-hover transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-80"
              >
                {isSubmitting ? 'Upgrading...' : 'Create Store'} <ChevronRight size={16} />
              </button>
            </div>
            
          </form>
        </main>
      </div>
    </div>
  );
};

export default SellerOnboarding;
