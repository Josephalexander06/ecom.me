import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, MapPin, Navigation, Check } from 'lucide-react';
import { useAuthStore, useUIStore } from '../../context/stores';

const PINCODE_CITY_MAP = {
  '110001': 'New Delhi',
  '122001': 'Gurugram',
  '201301': 'Noida',
  '226001': 'Lucknow',
  '302001': 'Jaipur',
  '380001': 'Ahmedabad',
  '400001': 'Mumbai',
  '411001': 'Pune',
  '422001': 'Nashik',
  '440001': 'Nagpur',
  '492001': 'Raipur',
  '500001': 'Hyderabad',
  '560001': 'Bengaluru',
  '600001': 'Chennai',
  '641001': 'Coimbatore',
  '682001': 'Kochi',
  '695001': 'Thiruvananthapuram',
  '700001': 'Kolkata',
  '751001': 'Bhubaneswar',
  '781001': 'Guwahati',
  '800001': 'Patna',
  '834001': 'Ranchi'
};

const PINCODE_PREFIX_CITY_MAP = {
  '110': 'New Delhi',
  '122': 'Gurugram',
  '201': 'Noida',
  '226': 'Lucknow',
  '302': 'Jaipur',
  '380': 'Ahmedabad',
  '400': 'Mumbai',
  '411': 'Pune',
  '422': 'Nashik',
  '440': 'Nagpur',
  '492': 'Raipur',
  '500': 'Hyderabad',
  '560': 'Bengaluru',
  '600': 'Chennai',
  '641': 'Coimbatore',
  '682': 'Kochi',
  '695': 'Thiruvananthapuram',
  '700': 'Kolkata',
  '751': 'Bhubaneswar',
  '781': 'Guwahati',
  '800': 'Patna',
  '834': 'Ranchi'
};

const getCityFromPincode = (pin) => {
  if (!/^\d{6}$/.test(pin)) return '';
  return PINCODE_CITY_MAP[pin] || PINCODE_PREFIX_CITY_MAP[pin.slice(0, 3)] || '';
};

const LocationModal = () => {
  const { activeModal, closeModals } = useUIStore();
  const { location, setLocation, detectLocation } = useAuthStore();
  const isOpen = activeModal === 'location';
  const [pincode, setPincode] = useState(location?.pincode || '');
  const [city, setCity] = useState(location?.city || '');
  const [isDetecting, setIsDetecting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPincode(location?.pincode || '');
      setCity(location?.city || '');
      setSuccess(false);
    }
  }, [isOpen, location?.city, location?.pincode]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (pincode.length !== 6) return;
    const mappedCity = getCityFromPincode(pincode);
    if (mappedCity) setCity(mappedCity);
  }, [pincode]);

  const resolvedCity = useMemo(() => getCityFromPincode(pincode), [pincode]);
  const isPincodeValid = /^\d{6}$/.test(pincode);
  const isReadyToSave = isPincodeValid && city.trim().length >= 2;

  if (!isOpen) return null;

  const handleSetLocation = (e) => {
    e.preventDefault();
    if (isReadyToSave) {
      setLocation({ city: city.trim(), pincode });
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
        setPincode(String(newLoc.pincode || ''));
        setCity(String(newLoc.city || resolvedCity || city || ''));
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

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm"
      onClick={closeModals}
      role="dialog"
      aria-modal="true"
      aria-label="Choose your location"
    >
      <div className="min-h-full flex items-start sm:items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-pro w-full max-w-md max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
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
              {pincode.length > 0 && !isPincodeValid && (
                <p className="text-xs text-danger">Pincode must be exactly 6 digits.</p>
              )}
              {isPincodeValid && resolvedCity && (
                <p className="text-xs text-success">Matched city: {resolvedCity}</p>
              )}
              {isPincodeValid && !resolvedCity && (
                <p className="text-xs text-warning">Could not auto-match this pincode. Please set city manually.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-bold text-text-secondary uppercase">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full bg-surface-secondary border border-border-default rounded-lg px-4 py-3 text-body font-bold focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>

            <button 
              type="submit"
              disabled={!isReadyToSave || success}
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
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LocationModal;
