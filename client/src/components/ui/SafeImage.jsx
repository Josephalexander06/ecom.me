import React, { useEffect, useState } from 'react';

const DEFAULT_FALLBACK = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f1f5f9"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#g)"/>
    <circle cx="350" cy="320" r="90" fill="#cbd5e1"/>
    <rect x="220" y="460" width="760" height="240" rx="28" fill="#cbd5e1"/>
    <text x="600" y="790" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" fill="#64748b">
      Image unavailable
    </text>
  </svg>`
)}`;

const SafeImage = ({ src, fallbackSrc = DEFAULT_FALLBACK, alt = '', ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      src={currentSrc || fallbackSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
      {...props}
    />
  );
};

export default SafeImage;
