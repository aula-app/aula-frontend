import OfflineView from '@/views/OfflineView';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LayoutContainer from './LayoutContainer';
import { useIsOnline } from '@/hooks/auth';

/**
 * Renders "Private Layout" composition
 * @component PrivateLayout
 */

const PrivateLayout: FunctionComponent<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    useIsOnline().then(setOnline);
  }, [location]);

  return !online ? <OfflineView /> : <LayoutContainer>{children}</LayoutContainer>;
};

export default PrivateLayout;
