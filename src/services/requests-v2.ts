import { localStorageGet } from '../utils/localStorage';

export interface VersionsResponse {
  'aula-backend': { running: string; latest: string };
  'aula-frontend': { minimum: string; recommended: string };
}

const DEFAULT_VERSIONS_RESPONSE = {
  'aula-backend': {
    running: 'unknown',
    latest: 'TODO',
  },
  'aula-frontend': {
    minimum: 'unknown',
    recommended: 'unknown',
  },
};

export const versionsRequest = async (): Promise<VersionsResponse> => {
  const instanceApiUrl = localStorageGet('api_url');
  try {
    return (await fetch(`${instanceApiUrl}/api/controllers/versions.php`)).json();
  } catch (e) {
    console.error('Error fetching v1 versions', e);
    try {
      return (await fetch(`${instanceApiUrl}/public/versions`)).json();
    } catch (e) {
      console.error('Error fetching v2 versions', e);
      return DEFAULT_VERSIONS_RESPONSE;
    }
  }
};
