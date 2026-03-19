import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, Check } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../context/stores';

const LocationModal = () => {
  const { activeModal, closeModals } = useUIStore();
  const { location, setLocation, detectLocation } = useAuthStore();
  const [pincode, setPincode] = useState(location.pincode || '');
  const [isDetecting, setIsDetecting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (activeModal !== 'location') return null;

  const handleSetLocation = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setLocation({ city: location.city || 'Mumbai', pincode });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeModals();
      }, 1000);
    }
  };

  const handleDetect = async () => {
    setIsDetecting(true);
    try {
      const newLoc = await detectLocation();
      if (newLoc) {
        setPincode(newLoc.pincode);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          closeModals();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      alert('Location detection failed. Please enter your pincode manually.');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-pro w-full max-w-md overflow-hidden relative shadow-2xl"
      >
        <button 
          onClick={closeModals}
          className="absolute top-4 right-4 p-2 hover:bg-surface-secondary rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center text-brand-primary">
              <MapPin size={24} />
            </div>
            <div>
              <h2 className="text-body font-bold text-text-primary">Choose your location</h2>
              <p className="text-caption text-text-muted">Select a delivery area to see product availability</p>
            </div>
          </div>

          <form onSubmit={handleSetLocation} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-text-secondary uppercase">Enter Pincode</label>
              <div className="relative">
                <input 
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 400001"
                  className="w-full bg-surface-secondary border border-border-default rounded-lg px-4 py-3 text-body font-bold focus:outline-none focus:border-brand-primary transition-colors"
                />
                {success && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                    <Check size={20} />
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={pincode.length !== 6 || success}
              className="w-full bg-brand-primary text-white py-3.5 rounded-lg font-bold hover:bg-brand-hover transition-all disabled:opacity-50"
            >
              Set Location
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-default"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-text-muted font-bold tracking-widest">or</span></div>
            </div>

            <button 
              type="button"
              onClick={handleDetect}
              disabled={isDetecting || success}
              className="w-full bg-white border border-border-default text-text-primary py-3.5 rounded-lg font-bold hover:bg-surface-secondary transition-all flex items-center justify-center gap-2"
            >
              {isDetecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                  Detecting...
                </>
              ) : (
                <>
                  <Navigation size={18} className="text-brand-primary" />
                  Use current location
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationModal;
