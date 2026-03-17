import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    const xDotTo = gsap.quickTo(dot, "x", { duration: 0, ease: "power3" });
    const yDotTo = gsap.quickTo(dot, "y", { duration: 0, ease: "power3" });
    const xRingTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const yRingTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    const handleMouseMove = (e) => {
      xDotTo(e.clientX);
      yDotTo(e.clientY);
      xRingTo(e.clientX);
      yRingTo(e.clientY);
    };

    const handleHoverStart = (e) => {
      const target = e.target;
      if (target.closest('button, a, .interactive')) {
        gsap.to(ring, {
          scale: 2,
          borderColor: 'var(--accent-primary)',
          backgroundColor: 'rgba(16, 206, 209, 0.1)',
          duration: 0.3
        });
        gsap.to(dot, { scale: 0.5, duration: 0.3 });
      }
    };

    const handleHoverEnd = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        backgroundColor: 'transparent',
        duration: 0.3
      });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleHoverStart);
    window.addEventListener('mouseout', handleHoverEnd);

    return () => {
      window.removeEventListener('resize', checkTouch);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleHoverStart);
      window.removeEventListener('mouseout', handleHoverEnd);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent-primary rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      />
      <div 
        ref={ringRef} 
        className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-300 hidden md:block"
      />
    </>
  );
};

export default CustomCursor;
