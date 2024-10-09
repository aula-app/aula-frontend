import { useIsAuthenticated } from '@/hooks/auth';
import { useAppStore } from '@/store/AppStore';
import { localStorageGet, parseJwt } from '@/utils';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

/**
 * Renders routes depending on Authenticated or Anonymous users
 */
const Routes = () => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};
export default Routes;
