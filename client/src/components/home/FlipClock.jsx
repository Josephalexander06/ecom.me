import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const FlipUnit = ({ value, label }) => {
  const [prevValue, setPrevValue] = useState(value);
  const cardRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (value !== prevValue) {
      const card = cardRef.current;
      const top = topRef.current;
      const bottom = bottomRef.current;

      gsap.to(card, {
        rotateX: -90,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setPrevValue(value);
          gsap.set(card, { rotateX: 90 });
          gsap.to(card, {
            rotateX: 0,
            duration: 0.3,
            ease: "back.out(2)",
          });
        }
      });
    }
  }, [value, prevValue]);

  const displayValue = String(value).padStart(2, '0');
  const prevDisplayValue = String(prevValue).padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-14 h-18 bg-surface-primary rounded-lg perspective-1000">
        {/* Top Half */}
        <div className="absolute inset-0 h-1/2 bg-surface-tertiary rounded-t-lg border-b border-black/10 flex items-end justify-center overflow-hidden">
          <span className="text-2xl font-mono font-bold text-text-primary translate-y-1/2">{displayValue}</span>
        </div>
        
        {/* Bottom Half */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-surface-secondary rounded-b-lg flex items-start justify-center overflow-hidden">
          <span className="text-2xl font-mono font-bold text-text-primary -translate-y-1/2">{prevDisplayValue}</span>
        </div>

        {/* Flipping Card */}
        <div 
          ref={cardRef}
          className="absolute inset-0 h-1/2 bg-surface-tertiary rounded-t-lg border-b border-black/10 flex items-end justify-center overflow-hidden origin-bottom preserve-3d"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-2xl font-mono font-bold text-text-primary translate-y-1/2">
            {prevValue === value ? displayValue : prevDisplayValue}
          </span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</span>
    </div>
  );
};

const FlipClock = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      
      setTimeLeft({ h, m, s });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2">
      <FlipUnit value={timeLeft.h} label="Hours" />
      <span className="text-2xl font-bold text-text-muted pt-4">:</span>
      <FlipUnit value={timeLeft.m} label="Min" />
      <span className="text-2xl font-bold text-text-muted pt-4">:</span>
      <FlipUnit value={timeLeft.s} label="Sec" />
    </div>
  );
};

export default FlipClock;
