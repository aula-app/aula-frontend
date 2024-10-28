import { useIsAuthenticated } from '@/hooks/auth';
import { FunctionComponent, PropsWithChildren } from 'react';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import PopupMessages from '@/components/PopupMessages';

/**
 * Returns the current Layout component depending on different circumstances.
 */
const CurrentLayout: FunctionComponent<PropsWithChildren> = (props) => {
  return (
    <>
      {useIsAuthenticated() ? <PrivateLayout {...props} /> : <PublicLayout {...props} />}
      <PopupMessages />
    </>
  );
};

export default CurrentLayout;
