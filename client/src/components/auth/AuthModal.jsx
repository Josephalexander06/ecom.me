import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../context/stores';

const AuthModal = () => {
  const { activeModal, closeModals } = useUIStore();
  const { login, register, loading, error } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(activeModal === 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (activeModal !== 'login' && activeModal !== 'register') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      closeModals();
    } catch (err) {
      // Error is handled by store
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-[420px] bg-white rounded-pro shadow-premium overflow-hidden relative"
        >
          {/* Close Button */}
          <button 
            onClick={closeModals}
            className="absolute right-4 top-4 p-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-h3 font-display text-text-primary mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-small text-text-secondary">
                {isLogin 
                  ? 'Sign in to access your orders and account.' 
                  : 'Join ecom.me for the next-gen shopping experience.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-caption font-medium text-text-secondary px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:border-brand-primary transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-caption font-medium text-text-secondary px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:border-brand-primary transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-caption font-medium text-text-secondary">Password</label>
                  {isLogin && (
                    <button type="button" className="text-caption text-brand-primary hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:border-brand-primary transition-colors"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              {error && (
                <p className="text-caption text-danger bg-danger/5 p-2.5 rounded-lg border border-danger/10">
                  {error}
                </p>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-hover text-white font-semibold py-3 rounded-pill transition-all flex items-center justify-center gap-2 group mt-4 overflow-hidden relative"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border-default text-center">
              <p className="text-small text-text-secondary">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={toggleMode}
                  className="ml-1.5 text-brand-primary font-semibold hover:underline"
                >
                  {isLogin ? 'Create one now' : 'Sign in instead'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
