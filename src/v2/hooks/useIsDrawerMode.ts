import { useEffect, useState } from 'react';

const DRAWER_MQ = '(width < 48rem)';

const useIsDrawerMode = () => {
  const [isDrawer, setIsDrawer] = useState(() => window.matchMedia(DRAWER_MQ).matches);
  useEffect(() => {
    const mq = window.matchMedia(DRAWER_MQ);
    const handler = (e: MediaQueryListEvent) => setIsDrawer(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDrawer;
};

export default useIsDrawerMode;
