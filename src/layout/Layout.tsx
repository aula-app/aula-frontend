<<<<<<< HEAD
import { useIsAuthenticated, useIsOnline } from '@/hooks/auth';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import PopupMessages from '@/dialogs/PopupMessages';
import { checkPermissions } from '@/utils';
=======
import { useIsAuthenticated } from '@/hooks/auth';
import { FunctionComponent, PropsWithChildren } from 'react';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import PopupMessages from '@/dialogs/PopupMessages';
>>>>>>> 578cd7c03f6062d78aec7a003679933bbabd9f9c

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
      {useIsAuthenticated() ? <PrivateLayout {...props} /> : <PublicLayout {...props} />}
      <PopupMessages />
    </>
  );
};

export default CurrentLayout;
