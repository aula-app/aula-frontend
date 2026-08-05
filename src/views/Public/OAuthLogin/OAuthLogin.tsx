import { Capacitor } from '@capacitor/core';
import { useAppStore } from '@/store';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { handleOAuthLogin } from '@/services/auth';
import { validateAndSaveInstanceCode } from '@/services/instance';
import { localStorageGet } from '@/utils';

// Webview origins of the Capacitor app builds (capacitor.config.ts: ios.scheme /
// server.androidScheme, hostname defaults to localhost).
const NATIVE_APP_ORIGINS: Record<string, string> = {
  ios: 'aula://localhost',
  android: 'https://localhost',
};

/**
 * The backend's SSO callback redirects to the instance's *web* frontend URL.
 * Inside the Capacitor webview that page is the remote copy of this SPA, whose
 * origin has its own localStorage — a JWT stored there is invisible to the
 * bundled app. Forward the callback to the app's own origin so login completes
 * where the app actually runs.
 */
const bounceToNativeOrigin = (): boolean => {
  if (!Capacitor.isNativePlatform()) return false;
  const appOrigin = NATIVE_APP_ORIGINS[Capacitor.getPlatform()];
  if (!appOrigin || window.location.origin === appOrigin) return false;
  window.location.replace(`${appOrigin}${window.location.pathname}${window.location.search}`);
  return true;
};

const OAuthLogin = () => {
  const { jwt_token } = useParams<{ jwt_token?: string }>();
  const [searchParams] = useSearchParams();
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (bounceToNativeOrigin()) return;
    (async () => {
      try {
        // IdP-initiated launches (e.g. Eduplaces marketplace) start without
        // an instance code in localStorage. The backend now passes the
        // resolved tenant back as `?code=…`; populate localStorage before
        // entering the app or every subsequent request will be tenantless.
        const codeFromUrl = searchParams.get('code');
        const codeInStorage = localStorageGet('code');
        if (codeFromUrl && codeFromUrl !== codeInStorage) {
          await validateAndSaveInstanceCode(codeFromUrl);
        }

        handleOAuthLogin(jwt_token);
        localStorage.removeItem('sso_force_login');
        dispatch({ type: 'LOG_IN' });
        navigate('/', { replace: true });
      } catch (error) {
        navigate('/login', { replace: true });
      }
    })();
  }, [jwt_token, searchParams, dispatch, navigate]);

  return null;
}

export default OAuthLogin;
