import { isVersionOutdated } from './version';

/**
 * Lowest Safari/WebKit version the SSO providers (Eduplaces, iServ) work with.
 * Below this the login redirect breaks, so the SSO button is disabled.
 */
export const MIN_SSO_SAFARI_VERSION = '16.4';

interface SafariInfo {
  /** A WebKit browser we gate on: any iOS browser, or desktop Safari on macOS. */
  isSafari: boolean;
  /** Marketing/WebKit version, or `null` when it cannot be read. */
  version: string | null;
}

const parseSafari = (ua: string): SafariInfo => {
  // On iOS every browser (and the Capacitor WKWebView) runs the OS WebKit, so
  // the version is tied to the OS regardless of the Chrome/Firefox wrapper.
  const isIOS = /\b(iPhone|iPad|iPod)\b/.test(ua);

  // Desktop Safari on macOS. Chromium/Gecko wrappers also carry a "Safari"
  // token, so they must be excluded explicitly or every Mac browser matches.
  const isMacSafari =
    /Macintosh/.test(ua) && /Safari/.test(ua) && !/(Chrome|Chromium|CriOS|FxiOS|Edg|OPR|Android)/.test(ua);

  if (!isIOS && !isMacSafari) {
    return { isSafari: false, version: null };
  }

  // "Version/16.4" is the canonical Safari marketing version on iOS and macOS.
  const versionMatch = ua.match(/Version\/(\d+(?:\.\d+)?)/);
  if (versionMatch) {
    return { isSafari: true, version: versionMatch[1] };
  }

  // iOS browser wrappers omit the Version token; fall back to the OS build,
  // which is the WebKit version actually running underneath.
  const osMatch = ua.match(/OS (\d+)_(\d+)(?:_(\d+))?/);
  if (osMatch) {
    return { isSafari: true, version: [osMatch[1], osMatch[2], osMatch[3]].filter(Boolean).join('.') };
  }

  return { isSafari: true, version: null };
};

/**
 * Whether the current browser can complete the SSO login flow.
 *
 * Only Safari/WebKit is gated; every other browser passes. When the version
 * cannot be determined we fail open so a mis-parsed UA never locks out a
 * school whose only way in is SSO.
 */
export const isSsoBrowserSupported = (ua: string = navigator.userAgent): boolean => {
  const { isSafari, version } = parseSafari(ua);
  if (!isSafari || !version) {
    return true;
  }
  return !isVersionOutdated(version, MIN_SSO_SAFARI_VERSION);
};
