import { handleOAuthLogin } from '@/services/auth';
import { validateAndSaveInstanceCode } from '@/services/instance';
import { useAppStore } from '@/store';
import { localStorageGet } from '@/utils';
import { Capacitor } from '@capacitor/core';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

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

/**
 * Browser leg of the sso callback; native builds land in useDeepLinks instead.
 *
 * useIsAuthenticated reads localStorage per render, so handleOAuthLogin alone
 * flips Routes from PublicRoutes to PrivateRoutes, which has no
 * /oauth-login/:jwt_token and falls through to NotFoundView. Any re-render
 * between the token write and navigate() hits that, usually useOutdatedGuard
 * in Layout resolving versionsRequest().
 *
 * Hence handleOAuthLogin -> navigate -> dispatch in one tick, no await between.
 * useIdpImportGate is not run here: PrivateRoutes runs it for every
 * authenticated render, and awaiting getIdpImportStatus reopens the gap.
 */
const OAuthLogin = () => {
  const { jwt_token } = useParams<{ jwt_token?: string }>();
  const [searchParams] = useSearchParams();
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();

  // useNavigate/useSearchParams change identity on the navigate() below, so the
  // effect would re-run handleOAuthLogin on a route already left.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

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

        // No await from here to the navigate below.
        handleOAuthLogin(jwt_token);
        localStorage.removeItem('sso_force_login');
        navigate('/', { replace: true });
        dispatch({ type: 'LOG_IN' });
      } catch {
        navigate('/login', { replace: true });
      }
    })();
  }, [jwt_token, searchParams, navigate, dispatch]);

  return null;
};

export default OAuthLogin;
