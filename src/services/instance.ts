import { loadConfig } from '@/config';
import { localStorageSet, localStorageGet } from '@/utils';

interface InstanceResponse {
  status: boolean;
  instanceApiUrl: string;
}

export const validateInstanceCode = async (code: string): Promise<boolean> => {
  const requestData = {
    method: 'POST',
    body: JSON.stringify({ code: code }),
  };

  let api_url = localStorageGet('config.api_url');
  if (api_url === null || api_url === '') {
    await loadConfig();
    api_url = localStorageGet('config.api_url');
  }

  const request = await fetch(`${api_url}/api/controllers/instance.php`, requestData);

  const response = (await request.json()) as InstanceResponse;

  if (response.status === true) {
    localStorageSet('code', code);
    localStorageSet('api_url', response.instanceApiUrl ?? localStorageGet('config.api_url'));
    return true;
  }
  return false;
};
