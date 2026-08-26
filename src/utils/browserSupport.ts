import { isVersionOutdated } from './version';

/**
 * Lowest Safari/WebKit version the SSO providers (Eduplaces, iServ) work with.
 * Below this the login redirect breaks, so the SSO button is disabled.
 */
export const MIN_SSO_SAFARI_VERSION = '16.4';

interface SafariInfo {
  isSafari: boolean;
  version: string | null;
}

const parseSafari = (ua: string): SafariInfo => {
  const isIOS = /\b(iPhone|iPad|iPod)\b/.test(ua);
  const isMacSafari =
    /Macintosh/.test(ua) && /Safari/.test(ua) && !/(Chrome|Chromium|CriOS|FxiOS|Edg|OPR|Android)/.test(ua);

  if (!isIOS && !isMacSafari) {
    return { isSafari: false, version: null };
  }

  const versionMatch = ua.match(/Version\/(\d+(?:\.\d+)?)/);
  if (versionMatch) {
    return { isSafari: true, version: versionMatch[1] };
  }

  const osMatch = ua.match(/OS (\d+)_(\d+)(?:_(\d+))?/);
  if (osMatch) {
    return { isSafari: true, version: [osMatch[1], osMatch[2], osMatch[3]].filter(Boolean).join('.') };
  }

  return { isSafari: true, version: null };
};

export const isSsoBrowserSupported = (ua: string = navigator.userAgent): boolean => {
  const { isSafari, version } = parseSafari(ua);
  if (!isSafari || !version) {
    return true;
  }
  return !isVersionOutdated(version, MIN_SSO_SAFARI_VERSION);
};
