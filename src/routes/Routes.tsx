import { useIsAuthenticated } from '@/hooks/auth';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

/**
 * Renders routes depending on Authenticated or Anonymous users
 */
const Routes = () => {
  const isAuthenticated = useIsAuthenticated(); // Variant 2

  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};
export default Routes;
