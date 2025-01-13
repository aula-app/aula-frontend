import { useIsAuthenticated } from '@/hooks/auth';
import { useAppStore } from '@/store/AppStore';
import { localStorageGet } from '@/utils';
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

interface ConsentResponse {
  data: number;
  error?: string;
}

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
      const response = await fetch(api_url + '/api/controllers/user_consent.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt_token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ConsentResponse = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      dispatch({
        action: 'HAS_CONSENT',
        payload: !(result.data === 0),
      });
    } catch (error) {
      console.error('Failed to fetch consent:', error);
      // You might want to dispatch an error state here
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
