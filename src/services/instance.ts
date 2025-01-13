import { localStorageSet } from '@/utils';

interface InstanceResponse {
  api: string;
}

export const validateInstanceCode = async (code: string): Promise<boolean> => {
  const request = await fetch(`${import.meta.env.VITE_APP_MULTI_AULA}/instance/${code}`);
  const response = (await request.json()) as InstanceResponse[];

  if (response.length > 0) {
    localStorageSet('code', code);
    localStorageSet('api_url', response[0].api);
    return true;
  }
  return false;
};
