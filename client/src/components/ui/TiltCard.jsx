import React, { useRef, useState } from 'react';

const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [style, setStyle] = useState({});
  const [glare, setGlare] = useState({ opacity: 0, x: 50, y: 50 });

  const onMove = (event) => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = -((y / rect.height) - 0.5) * 12;

    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
      transition: 'transform 90ms ease-out'
    });
    setGlare({
      opacity: 0.22,
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const onLeave = () => {
    setStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 220ms ease'
    });
    setGlare({ opacity: 0, x: 50, y: 50 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className={`relative ${className}`}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(175,224,255,0.45), transparent 38%)`,
          transition: 'opacity 160ms ease'
        }}
      />
    </div>
  );
};

export default TiltCard;
