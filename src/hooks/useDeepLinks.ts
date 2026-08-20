import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Routes a deep link into the app the same way a URL routes the website.
 *
 * SSO cannot finish inside the WebView: the authorize page is off-origin, so
 * Capacitor hands it to the system browser, and the WebView never sees the
 * result. The backend therefore ends an app-initiated login on our custom
 * scheme (`de.aula.neu://oauth-login/<jwt>`), which Android delivers here.
 *
 * The scheme carries no meaning of its own: everything after it is an ordinary
 * frontend route, so the path is passed to the router untouched and the usual
 * views handle it. That keeps the app and the website on one set of routes.
 */
export const useDeepLinks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listener = App.addListener('appUrlOpen', async ({ url }: URLOpenListenerEvent) => {
      const route = routeFromDeepLink(url);
      if (!route) return;

      // The login ran in a Custom Tab layered over the app. Nothing dismisses
      // it on the way back, so it would sit on top of the view we just
      // navigated to. Failing to close is not worth blocking the login over:
      // on some platforms there is no tab to close.
      await Browser.close().catch(() => undefined);

      navigate(route, { replace: true });
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, [navigate]);
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
