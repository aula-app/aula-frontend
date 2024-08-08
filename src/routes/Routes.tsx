import { useIsAuthenticated } from '@/hooks/auth';
import { useAppStore } from '@/store/AppStore';
import { getCurrentUser, localStorageGet, parseJwt } from '@/utils';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';
import PublicRoutes from './PublicRoutes';

/**
 * Renders routes depending on Authenticated or Anonymous users
 */
const Routes = () => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated(); // Variant 2
  const [, dispatch] = useAppStore();

  useEffect(() => {
    const jwt_token = localStorageGet('token');

    const getConsent = async () => {
      const data = await (
        await fetch(import.meta.env.VITE_APP_API_URL + '/api/controllers/user_consent.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt_token,
          },
          body: JSON.stringify({ user_id: getCurrentUser() }),
        })
      ).json();

      const result = data; // await api.auth.loginWithEmail(values);
      if (result.data && result.data === 0) {
        dispatch({ action: 'HAS_CONSENT', payload: false });
      } else {
        dispatch({ action: 'HAS_CONSENT', payload: true });
      }
    };

    getConsent();
  }, [isAuthenticated, location]);

  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};
export default Routes;
