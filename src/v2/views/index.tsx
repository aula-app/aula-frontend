import { useIsAuthenticated } from '@/hooks/auth';
import { useOutdatedGuard } from '@/hooks/useOutdatedGuard';
import OutdatedView from '@/views/OutdatedView';
import { FunctionComponent, PropsWithChildren } from 'react';
import { useLocation } from 'react-router';
import PrivateLayout from './private';
import PublicLayout from './public';

const Layout: FunctionComponent<PropsWithChildren> = (props) => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const { isOutdated } = useOutdatedGuard(location.pathname);

  if (isOutdated) {
    return <OutdatedView />;
  }

  return isAuthenticated ? <PrivateLayout {...props} /> : <PublicLayout {...props} />;
};

export default Layout;
