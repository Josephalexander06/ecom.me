import { useState, useEffect } from 'react';

/**
 * useIsDesktop Hook
 * Returns true if viewport is lg (1024px) or larger.
 */
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isDesktop;
};

export default useIsDesktop;
