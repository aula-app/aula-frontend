import { useConsentSync, useIsAuthenticated } from '@/hooks/auth';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';
import { useLocation } from 'react-router';

/**
 * Renders routes depending on Authenticated or Anonymous users
 */
const Routes = () => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated(); // Variant 2

  useConsentSync(isAuthenticated, location.pathname);

  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};
export default Routes;
