import { useIsAuthenticated } from '@/hooks/auth';
import { useAppStore } from '@/store/AppStore';
import { localStorageGet } from '@/utils';
import { getUserConsent } from '@/services/consent';
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

/**
 * Renders routes depending on Authenticated or Anonymous users
 */
const Routes = () => {
  const [, dispatch] = useAppStore();
  const location = useLocation();
  const api_url = localStorageGet('api_url');
  const isAuthenticated = useIsAuthenticated(); // Variant 2
  const jwt_token = localStorageGet('token');

  const getConsent = useCallback(async () => {
    if (!jwt_token || !api_url) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const result = await getUserConsent(jwt_token, controller.signal);
      clearTimeout(timeoutId);

      dispatch({
        action: 'HAS_CONSENT',
        payload: !(result.data === 0),
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          // Consent request timeout
        } else if (error.name === 'NetworkError') {
          // Network error while fetching consent
        } else {
          // Failed to fetch consent
        }
      }
      dispatch({
        action: 'HAS_CONSENT',
        payload: false,
      });
    }
  }, [api_url, jwt_token, dispatch]);

  useEffect(() => {
    getConsent();
  }, [isAuthenticated, location, getConsent]);

  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};
export default Routes;
