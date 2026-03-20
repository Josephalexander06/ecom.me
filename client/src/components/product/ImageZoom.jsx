import React, { useState, useRef } from 'react';
import SafeImage from '../ui/SafeImage';

const ImageZoom = ({ src, alt }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = useState(false);
  const containerRef = useRef(null);

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      ref={containerRef}
      onPointerEnter={() => setShowLens(true)}
      onPointerLeave={() => setShowLens(false)}
      onPointerMove={handlePointerMove}
      className="relative w-full aspect-square bg-surface-secondary rounded-img overflow-hidden cursor-zoom-in border border-border-default"
    >
      <SafeImage 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
      
      {showLens && (
        <div 
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: '250%',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
    </div>
  );
};

export default ImageZoom;
