import { localStorageSet, localStorageGet } from '@/utils';

interface InstanceResponse {
  status: boolean;
}

export const validateInstanceCode = async (code: string): Promise<boolean> => {
  const requestData = {
    method: 'POST',
    body: JSON.stringify({ code: code }),
  };

  const api_url = localStorageGet('api_url');
  const request = await fetch(`${api_url}/api/controllers/instance.php`, requestData);

  const response = (await request.json()) as InstanceResponse;

  if (response.status === true) {
    localStorageSet('code', code);
    return true;
  }
  return false;
};
