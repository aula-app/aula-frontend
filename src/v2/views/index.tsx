import { useIsAuthenticated } from '@/hooks/auth';
import { useOutdatedGuard } from '@/hooks/useOutdatedGuard';
import OutdatedView from '@/views/OutdatedView';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useLocation } from 'react-router';
import PrivateLayout from './private';
import PublicLayout from './public';
import Toast from '@/v2/components/ui/Toast';

/**
 * Returns the current Layout component depending on different circumstances.
 * Note: Page titles are now managed by individual views using usePageTitle hook (WCAG 2.4.2)
 */
const Layout: FunctionComponent<PropsWithChildren> = (props) => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated(); // Variant 2
  const { isOutdated } = useOutdatedGuard(location.pathname);

  if (isOutdated) {
    return <OutdatedView />;
  }

  return (
    <>
      {isAuthenticated ? <PrivateLayout {...props} /> : <PublicLayout {...props} />}
      <Toast />
    </>
  );
};

export default Layout;
