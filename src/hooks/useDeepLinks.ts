import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom URL scheme used for native deep-link callbacks (e.g. the SSO flow).
 * Distinct from the iOS content scheme (`aulaapp://localhost`) so the two
 * never collide.
 */
const DEEP_LINK_SCHEME = 'aula://';

/**
 * Handles native deep links opened via the `aula://` custom scheme.
 *
 * The SSO flow opens the IdP in an in-app browser tab; the backend finishes
 * by redirecting to `aula://oauth-login/<jwt>` (or `aula://login?sso_error=...`
 * on failure). iOS/Android hand that URL to the app, which fires `appUrlOpen`.
 * We close the browser tab and route the equivalent in-app path so the SPA
 * (OAuthLogin / LoginView) completes the login.
 */
export const useDeepLinks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handle = App.addListener('appUrlOpen', async (event: URLOpenListenerEvent) => {
      const { url } = event;
      if (!url || !url.startsWith(DEEP_LINK_SCHEME)) return;

      // Dismiss the SSO in-app browser tab (no-op if none is open).
      await Browser.close().catch(() => {});

      try {
        // aula://oauth-login/<jwt>   -> /oauth-login/<jwt>
        // aula://login?sso_error=... -> /login?sso_error=...
        const parsed = new URL(url);
        const route = `/${parsed.hostname}${parsed.pathname}${parsed.search}`;
        navigate(route, { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    });

    return () => {
      handle.then((listener) => listener.remove());
    };
  }, [navigate]);
};
