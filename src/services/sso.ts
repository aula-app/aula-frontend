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
  legacyJwt: string,
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

export const initiateSso = async (apiUrl: string): Promise<string> => {
  const instanceCode = localStorageGet('code');
  const forceLogin = localStorage.getItem('sso_force_login') === 'true';
  // Keep the flag set until login succeeds (cleared in OAuthLogin).

  const initiateUrl = new URL(`${apiUrl}/api/v2/auth/sso/initiate`);
  if (forceLogin) initiateUrl.searchParams.set('force_login', 'true');

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
