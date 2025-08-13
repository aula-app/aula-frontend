import { useIsAuthenticated } from '@/hooks/auth';
import { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import PopupMessages from '@/components/PopupMessages';
import { APP_TITLE } from '@/config';

/**
 * Returns the current Layout component depending on different circumstances.
 */
const CurrentLayout: FunctionComponent<PropsWithChildren> = (props) => {
  useEffect(() => {
    document.title = APP_TITLE;
  }, []);

  return (
    <>
      {useIsAuthenticated() ? <PrivateLayout {...props} /> : <PublicLayout {...props} />}
      <PopupMessages />
    </>
  );
};

export default CurrentLayout;
