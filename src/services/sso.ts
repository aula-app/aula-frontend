import { Capacitor } from '@capacitor/core';

import { localStorageGet } from '@/utils';

/**
 * Complete the account-link flow started by the SSO callback.
 *
 * When the SSO callback finds a legacy account matching the IdP-asserted
 * email but no sso_sub binding yet, it redirects to
 * /login?sso_error=account_link_required&sso_link=<opaque_token>. The user
 * then logs in normally with their legacy password (proving possession);
 * this call attaches the IdP identity to that legacy row.
 */
export const completeSsoLink = async (
  apiUrl: string,
  ssoLinkToken: string,
  legacyJwt: string
): Promise<{ success: boolean; error?: string }> => {
  const instanceCode = localStorageGet('code');

  const response = await fetch(`${apiUrl}/api/v2/auth/sso/link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${legacyJwt}`,
      'aula-instance-code': instanceCode ?? '',
      'aula-frontend-version': import.meta.env.VITE_APP_VERSION ?? 'unknown',
    },
    body: JSON.stringify({ sso_link_token: ssoLinkToken }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    return { success: false, error: body?.error ?? 'sso_link_failed' };
  }

  return { success: true };
};

export interface SsoStatus {
  enabled: boolean;
  required: boolean;
  provider: string | null;
}

/**
 * Whether the school behind the current instance code offers SSO.
 *
 * Deployment config only says whether this aula has an identity provider at
 * all; the toggle an operator sets per school lives on the backend. Both have
 * to be true before a login page offers the button, or schools that do not use
 * SSO get one that can only ever refuse them.
 *
 * Returns null when the question cannot be answered, which callers treat as
 * "leave it as the deployment config says" rather than hiding a button a school
 * may well be entitled to.
 */
export const getSsoStatus = async (apiUrl: string): Promise<SsoStatus | null> => {
  const instanceCode = localStorageGet('code');

  try {
    const response = await fetch(`${apiUrl}/api/v2/auth/sso/status`, {
      headers: {
        Accept: 'application/json',
        'aula-instance-code': instanceCode ?? '',
        'aula-frontend-version': import.meta.env.VITE_APP_VERSION ?? 'unknown',
      },
    });

    if (!response.ok) return null;

    const body = await response.json();

    if (typeof body?.enabled !== 'boolean') return null;

    return {
      enabled: body.enabled,
      required: body?.required === true,
      provider: typeof body?.provider === 'string' ? body.provider : null,
    };
  } catch {
    return null;
  }
};

export interface InitiateSsoOptions {
  /**
   * Opaque blob from an OIDC third-party initiated login launcher (e.g.
   * Eduplaces marketplace). Forwarded to Keycloak/Eduplaces so the user
   * is pre-selected and the second hop is silent.
   */
  loginHint?: string;
}

export const initiateSso = async (apiUrl: string, options: InitiateSsoOptions = {}): Promise<string> => {
  const instanceCode = localStorageGet('code');
  const forceLogin = localStorage.getItem('sso_force_login') === 'true';
  // Keep the flag set until login succeeds (cleared in OAuthLogin).

  const initiateUrl = new URL(`${apiUrl}/api/v2/auth/sso/initiate`);
  if (forceLogin) initiateUrl.searchParams.set('force_login', 'true');
  if (options.loginHint) initiateUrl.searchParams.set('login_hint', options.loginHint);
  // Ask the backend to finish on our deep-link scheme instead of on the
  // website. It travels inside the signed state, so it survives the round trip
  // through Keycloak and is still there when the callback picks a destination.
  if (Capacitor.isNativePlatform()) initiateUrl.searchParams.set('client', 'app');

  const response = await fetch(initiateUrl.toString(), {
    method: 'GET',
    headers: {
      'aula-instance-code': instanceCode ?? '',
      'aula-frontend-version': import.meta.env.VITE_APP_VERSION ?? 'unknown',
    },
  });

  if (!response.ok) {
    throw new Error('sso_initiate_failed');
  }

  const { url } = await response.json();

  if (!url) {
    throw new Error('sso_no_redirect_url');
  }

  return url;
};

export interface IdpImportStatus {
  /** False while the school is still being pulled in from the provider. */
  ready: boolean;
  provider: string | null;
  status: 'pending' | 'running' | 'completed' | 'failed' | null;
  rooms: number;
  users: number;
  error: string | null;
}

/**
 * How far the initial directory import has got.
 *
 * The first person to sign in at a school triggers an import of its rooms and
 * users, which runs on the backend queue. Until it finishes the school is only
 * half there, so callers hold the user on a waiting screen while `ready` is
 * false.
 *
 * Tenants that sync from no directory report ready immediately, so this is safe
 * to call on every login.
 */
export const getIdpImportStatus = async (apiUrl: string, legacyJwt: string): Promise<IdpImportStatus | null> => {
  const instanceCode = localStorageGet('code');

  try {
    const response = await fetch(`${apiUrl}/api/v2/auth/idp/import-status`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${legacyJwt}`,
        'aula-instance-code': instanceCode ?? '',
        'aula-frontend-version': import.meta.env.VITE_APP_VERSION ?? 'unknown',
      },
    });

    if (!response.ok) return null;

    return (await response.json()) as IdpImportStatus;
  } catch {
    // A backend that cannot answer must not strand the user on the waiting
    // screen; the caller treats null as "carry on".
    return null;
  }
};
