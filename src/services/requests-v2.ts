import { localStorageGet } from '../utils/localStorage';

export interface VersionsResponse {
  'aula-backend.v1': { running: string; latest: string };
  'aula-backend.v2': { running: string; latest: string };
  'aula-frontend'?: { minimum: string; recommended: string };
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
  const v1 = await v1Request(instanceApiUrl);
  const v2 = await v2Request(instanceApiUrl);
  return { 'aula-backend.v1': v1['aula-backend'], 'aula-backend.v2': v2['aula-backend'] } as VersionsResponse;
};

const v1Request = async (instanceApiUrl: string) => {
  try {
    return (await fetch(`${instanceApiUrl}/api/controllers/versions.php`)).json();
  } catch (e) {
    console.error('Error fetching v1 versions', e);
    return DEFAULT_VERSIONS_RESPONSE;
  }
};

const v2Request = async (instanceApiUrl: string) => {
  try {
    return (await fetch(`${instanceApiUrl}/public/versions`)).json();
  } catch (e) {
    console.error('Error fetching v2 versions', e);
    return DEFAULT_VERSIONS_RESPONSE;
  }
};
