import { localStorageGet } from '@/utils';

/**
 * Calls the SSO initiation endpoint and navigates the browser to Keycloak.
 * The aula-instance-code header is required for tenant identification.
 */
export const initiateSso = async (apiUrl: string): Promise<void> => {
  const instanceCode = localStorageGet('code');

  const response = await fetch(`${apiUrl}/api/v2/auth/sso/initiate`, {
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

  window.location.href = url;
};
