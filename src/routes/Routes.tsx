import { useIsAuthenticated, useConsentSync } from '@/hooks/auth';
import { useOutdatedGuard } from '@/hooks/useOutdatedGuard';
import { useLocation } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import OutdatedView from '@/views/OutdatedView';

/**
 * Renders routes depending on Authenticated or Anonymous users
 */
const Routes = () => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated(); // Variant 2
  const { isOutdated } = useOutdatedGuard(location.pathname);

  useConsentSync(isAuthenticated, location.pathname);

  if (isOutdated) {
    return <OutdatedView />;
  }

  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};
export default Routes;
