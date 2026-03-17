import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const PreloaderScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Speed up simulation for better UX
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 25;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const tl = gsap.timeline({
        onComplete: () => onComplete(),
      });

      tl.to('.preloader-content', {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: 'power3.inOut',
      })
      .to('.preloader-bg', {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1,
        ease: 'power4.inOut',
      });
    }
  }, [progress, onComplete]);

  return (
    <div className="preloader-bg fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020202]">
      <div className="preloader-content flex flex-col items-center">
        <div className="mb-8 overflow-hidden">
          <h1 className="text-6xl md:text-8xl font-display text-white tracking-widest opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
            AETHER
          </h1>
          <div className="h-0.5 w-full bg-accent-primary scale-x-0 animate-[scaleX_1.5s_ease-in-out_forwards_0.5s] origin-left" />
        </div>

        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-accent-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <span className="mt-4 font-mono text-accent-primary text-xs tracking-widest uppercase">
          Neural-Sync: {Math.floor(progress)}%
        </span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default PreloaderScreen;
