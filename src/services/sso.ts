import { localStorageGet } from '@/utils';

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
