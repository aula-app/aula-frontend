import { useIdpImportGate } from '@/hooks/useIdpImportGate';
import { handleOAuthLogin } from '@/services/auth';
import { validateAndSaveInstanceCode } from '@/services/instance';
import { useAppStore } from '@/store';
import { localStorageGet } from '@/utils';
import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import SchoolSetupView from '../SchoolSetupView';

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
  const [authenticated, setAuthenticated] = useState(false);

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
        setAuthenticated(true);
      } catch (error) {
        navigate('/login', { replace: true });
      }
    })();
  }, [jwt_token, searchParams, navigate]);

  return authenticated ? <ImportGate onEnter={() => { dispatch({ type: 'LOG_IN' }); navigate('/', { replace: true }); }} /> : null;
};

/**
 * Sits between a completed login and aula itself.
 *
 * Only mounted once the token is stored, because the status endpoint is
 * authenticated. Schools with nothing to import pass through without ever
 * rendering anything.
 */
const ImportGate: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  const { phase, status, dismiss } = useIdpImportGate();

  useEffect(() => {
    if (phase === 'clear') onEnter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === 'checking' || phase === 'clear') return null;

  return <SchoolSetupView phase={phase} status={status} onDismiss={dismiss} />;
};

export default OAuthLogin;
