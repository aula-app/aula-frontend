import { getRuntimeConfig, loadRuntimeConfig } from '@/config';
import { localStorageSet } from '@/utils';

interface InstanceResponse {
  status: boolean;
  instanceApiUrl: string;
}

export const validateAndSaveInstanceCode = async (code: string): Promise<boolean> => {
  const requestData = {
    method: 'POST',
    body: JSON.stringify({ code: code }),
    headers: {
      'aula-frontend-version': import.meta.env.VITE_APP_VERSION,
    },
  };

  let api_url = getRuntimeConfig().CENTRAL_API_URL;
  if (api_url === null || api_url === '') {
    api_url = (await loadRuntimeConfig()).CENTRAL_API_URL;
  }

  const request = await fetch(`${api_url}/api/controllers/instance.php`, requestData);

  const response = (await request.json()) as InstanceResponse;

  if (response.status === true) {
    localStorageSet('code', code);
    localStorageSet('api_url', response.instanceApiUrl ?? getRuntimeConfig().CENTRAL_API_URL);
    return true;
  }
  return false;
};
