import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleOAuthLogin } from '@/services/auth';
import { validateAndSaveInstanceCode } from '@/services/instance';
import { useAppStore } from '@/store';
import { localStorageGet } from '@/utils';

/**
 * Routes a deep link into the app.
 *
 * SSO cannot finish inside the WebView: the authorize page is off-origin, so
 * Capacitor hands it to the system browser, and the WebView never sees the
 * result. The backend ends an app-initiated login on our custom scheme
 * (`de.aula.neu://oauth-login/<jwt>`), which Android delivers here.
 *
 * The session is established here rather than by navigating to the
 * `oauth-login` route: that route is registered in PublicRoutes only, so the
 * moment the token is stored the app switches to PrivateRoutes, which has no
 * such route and renders NotFoundView. Every other path is handed to the
 * router untouched.
 */
export const useDeepLinks = () => {
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();

  // Both change identity on every location or store change. Held in a ref so
  // the listener is registered once instead of being torn down and replaced on
  // each navigation.
  const latest = useRef({ navigate, dispatch });
  latest.current = { navigate, dispatch };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handled = '';

    const listener = App.addListener('appUrlOpen', async ({ url }: URLOpenListenerEvent) => {
      // Android can deliver the same intent more than once, and the plugin
      // retains the event until a listener consumes it.
      if (url === handled) return;
      handled = url;

      const route = routeFromDeepLink(url);
      if (!route) return;

      // The login ran in a Custom Tab layered over the app; nothing dismisses
      // it on the way back. Not worth blocking the login over: some platforms
      // have no tab to close.
      await Browser.close().catch(() => undefined);

      const session = sessionFromRoute(route);

      if (!session) {
        latest.current.navigate(route, { replace: true });

        return;
      }

      try {
        if (session.code && session.code !== localStorageGet('code')) {
          await validateAndSaveInstanceCode(session.code);
        }

        handleOAuthLogin(session.token);
        localStorage.removeItem('sso_force_login');

        // Navigate before the store flips, so the authenticated tree renders
        // at `/` rather than briefly at the route it cannot match.
        latest.current.navigate('/', { replace: true });
        latest.current.dispatch({ type: 'LOG_IN' });
      } catch {
        latest.current.navigate('/login', { replace: true });
      }
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, []);
};

/**
 * The session an `/oauth-login/<jwt>?code=<instance>` route carries, or null
 * for any other route.
 */
const sessionFromRoute = (route: string): { token: string; code: string | null } | null => {
  const match = /^\/oauth-login\/([^/?]+)/.exec(route);

  if (!match) return null;

  const query = route.slice(route.indexOf('?') + 1);

  return {
    token: match[1],
    code: route.includes('?') ? new URLSearchParams(query).get('code') : null,
  };
};

/**
 * The in-app route a deep link refers to, or null when the URL is not one of
 * ours.
 *
 * A custom scheme has no authority component, so Android reports
 * `de.aula.neu://oauth-login/<jwt>` with `oauth-login` as the host and the rest
 * as the path. Both halves have to be stitched back together to recover the
 * route the backend meant.
 */
const routeFromDeepLink = (url: string): string | null => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  // Universal/app links arrive as https URLs and already carry a full path;
  // custom-scheme links keep their first segment in the host.
  const path = parsed.protocol.startsWith('http')
    ? parsed.pathname
    : `/${parsed.host}${parsed.pathname}`;

  const route = `${path}${parsed.search}`;

  return route === '/' ? null : route;
};
