import { useIsAuthenticated, useIsOnline } from '@/hooks/auth';
import OfflineView from '@/views/OfflineView';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';

/**
 * Returns the current Layout component depending on different circumstances.
 */
const CurrentLayout: FunctionComponent<PropsWithChildren> = (props) => {
  if (!useIsAuthenticated()) return <PublicLayout {...props} />;

  const [online, setOnline] = useState(true);
  const location = useLocation();

  const checkOnlineStatus = async () => {
    setOnline(await useIsOnline());
  };

  useEffect(() => {
    checkOnlineStatus();
  }, [location]);

  return online ? <PrivateLayout {...props} /> : <OfflineView />;
};

export default CurrentLayout;
