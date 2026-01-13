import { useIsAuthenticated } from '@/hooks/auth';
import { FunctionComponent, PropsWithChildren } from 'react';
import PrivateLayout from './PrivateLayout';
import PublicLayout from './PublicLayout';
import PopupMessages from '@/components/PopupMessages';

/**
 * Returns the current Layout component depending on different circumstances.
 * Note: Page titles are now managed by individual views using usePageTitle hook (WCAG 2.4.2)
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
