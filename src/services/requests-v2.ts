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
  const v1 = await baseVersionsRequest(`${instanceApiUrl}/api/controllers/versions.php`, 'v1');
  const v2 = await baseVersionsRequest(`${instanceApiUrl}/public/versions`, 'v2');
  return { 'aula-backend.v1': v1['aula-backend'], 'aula-backend.v2': v2['aula-backend'] } as VersionsResponse;
};

const baseVersionsRequest = async (versionsUrl: string, version: string) => {
  try {
    const response = await fetch(versionsUrl);
    if (response && response.ok) {
      return response.json();
    } else {
      console.error(`Error fetching version ${version}. Status: ${response.status}`);
      return DEFAULT_VERSIONS_RESPONSE;
    }
  } catch (e) {
    console.error(`Error fetching version ${version}`, e);
    return DEFAULT_VERSIONS_RESPONSE;
  }
};
