import { useLayoutEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useLayoutEffect(() => {
    const check = () => {
      const isCurrentlyMobile = window.innerWidth < breakpoint;
      setIsMobile(prev => (prev !== isCurrentlyMobile ? isCurrentlyMobile : prev));
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}
