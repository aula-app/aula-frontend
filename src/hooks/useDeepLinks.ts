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
 * Handles `de.aula.neu://` deep links, how the sso callback returns from the
 * browser it ran in.
 *
 * The session is established here, not by routing to `/oauth-login/<jwt>`:
 * that route exists only in PublicRoutes, and storing the token switches the
 * app to PrivateRoutes, which 404s it. Other paths go to the router as-is.
 */
export const useDeepLinks = () => {
  const navigate = useNavigate();
  const [, dispatch] = useAppStore();

  // Both change identity on every location or store change; a ref keeps the
  // listener registered once.
  const latest = useRef({ navigate, dispatch });
  latest.current = { navigate, dispatch };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handled = '';

    const listener = App.addListener('appUrlOpen', async ({ url }: URLOpenListenerEvent) => {
      // Android can redeliver, and the plugin retains the event until consumed.
      if (url === handled) return;
      handled = url;

      const route = routeFromDeepLink(url);
      if (!route) return;

      // Dismiss the Custom Tab the login ran in; absent on some platforms.
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

        // Navigate first: the store flip renders PrivateRoutes, which has no
        // route for the current path.
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

/** Token and instance code from `/oauth-login/<jwt>?code=<instance>`. */
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
 * Deep-link URL to in-app route. A custom scheme has no authority component,
 * so `de.aula.neu://oauth-login/<jwt>` parses with `oauth-login` as the host.
 */
const routeFromDeepLink = (url: string): string | null => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  // https app links already carry the full path.
  const path = parsed.protocol.startsWith('http')
    ? parsed.pathname
    : `/${parsed.host}${parsed.pathname}`;

  const route = `${path}${parsed.search}`;

  return route === '/' ? null : route;
};
