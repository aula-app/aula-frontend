import ErrorMessages from '@/dialogs/ErrorMessages';
import { useIsAuthenticated, useIsOnline } from '@/hooks/auth';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import OfflineView from '@/views/OfflineView';
import { checkPermissions } from '@/utils';

/**
 * Returns the current Layout component depending on different circumstances.
 */
const CurrentLayout: FunctionComponent<PropsWithChildren> = (props) => {
  const [online, setOnline] = useState(true);

  const checkOnlineStatus = async () => setOnline(await useIsOnline());

  useEffect(() => {
    if (!checkPermissions(50)) checkOnlineStatus();
  }, [location]);

  return (
    <>
      {useIsAuthenticated() ? online ? <PrivateLayout {...props} /> : <OfflineView /> : <PublicLayout {...props} />}
      <ErrorMessages />
    </>
  );
};

export default CurrentLayout;
