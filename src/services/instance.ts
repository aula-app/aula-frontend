import { getConfig, loadConfig } from '@/config';
import { localStorageSet, localStorageGet } from '@/utils';

interface InstanceResponse {
  status: boolean;
  instanceApiUrl: string;
}

export const validateAndSaveInstanceCode = async (code: string): Promise<boolean> => {
  const requestData = {
    method: 'POST',
    body: JSON.stringify({ code: code }),
  };

  let api_url = getConfig('CENTRAL_API_URL');
  if (api_url === null || api_url === '') {
    await loadConfig();
    api_url = getConfig('CENTRAL_API_URL');
  }

  const request = await fetch(`${api_url}/api/controllers/instance.php`, requestData);

  const response = (await request.json()) as InstanceResponse;

  if (response.status === true) {
    localStorageSet('code', code);
    localStorageSet('api_url', response.instanceApiUrl ?? getConfig('CENTRAL_API_URL'));
    return true;
  }
  return false;
};
