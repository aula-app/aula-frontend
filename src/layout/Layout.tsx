import { useIsAuthenticated, useIsOnline } from '@/hooks/auth';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import PopupMessages from '@/dialogs/PopupMessages';
import { checkPermissions } from '@/utils';
import OfflineView from '@/views/OfflineView';
import { useLocation } from 'react-router-dom';

/**
 * Returns the current Layout component depending on different circumstances.
 */
const CurrentLayout: FunctionComponent<PropsWithChildren> = (props) => {
  const [online, setOnline] = useState(true);
  const location = useLocation();

  const checkOnlineStatus = async () => setOnline(await useIsOnline());

  useEffect(() => {
    checkOnlineStatus();
  }, [location]);

  return (
    <>
      {useIsAuthenticated() ? online ? <PrivateLayout {...props} /> : <OfflineView /> : <PublicLayout {...props} />}
      <PopupMessages />
    </>
  );
};

export default CurrentLayout;
