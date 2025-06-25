import { localStorageSet } from '@/utils';
import { getConfig } from '../config';

interface InstanceResponse {
  api: string;
}

export const validateInstanceCode = async (code: string): Promise<boolean> => {
  const request = await fetch(`${getConfig().MULTI_INSTANCES_URL}/instance/${code}`);
  const response = (await request.json()) as InstanceResponse[];

  if (response.length > 0) {
    localStorageSet('code', code);
    localStorageSet('api_url', response[0].api);
    return true;
  }
  return false;
};
