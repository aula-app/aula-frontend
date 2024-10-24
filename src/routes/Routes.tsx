import { useIsAuthenticated } from '@/hooks/auth';
import { useAppStore } from '@/store/AppStore';
import { localStorageGet } from '@/utils';
import { useEffect } from 'react';
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

  const getConsent = async () => {
    if (!jwt_token) return;
    const data = await (
      await fetch(api_url + '/api/controllers/user_consent.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt_token,
        },
      })
    ).json();

    const result = data; // await api.auth.loginWithEmail(values);
    if (result.data && result.data === 0) {
      dispatch({ action: 'HAS_CONSENT', payload: false });
    } else {
      dispatch({ action: 'HAS_CONSENT', payload: true });
    }
  };

  useEffect(() => {
    getConsent();
  }, [isAuthenticated, location]);

  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
};
export default Routes;
