import { localStorageGet } from '../utils/localStorage';

export interface VersionsResponse {
  'aula-backend': { running: string; latest: string };
  'aula-frontend': { minimum: string; recommended: string };
}

export const versionsRequest = async (): Promise<VersionsResponse> => {
  const instanceApiUrl = localStorageGet('api_url');
  try {
    return (await fetch(`${instanceApiUrl}/public/versions`)).json();
  } catch (e) {
    console.error('Error fetching versions', e);
    return {
      'aula-backend': {
        running: 'unknown',
        latest: 'TODO',
      },
      'aula-frontend': {
        minimum: 'unknown',
        recommended: 'unknown',
      },
    };
  }
};
