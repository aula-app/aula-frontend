import { ObjectPropByName } from '@/types/Generics';
import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';
import { ScopeResponseType } from '@/types/RequestTypes';

export interface RequestObject {
  model: string;
  method: string;
  arguments: ObjectPropByName;
}

const error = new CustomEvent('AppErrorDialog', { detail: 'texts.error' });

export const databaseRequest = async (
  requestData: RequestObject,
  userId = [] as string[]
): Promise<ScopeResponseType | { success: false }> => {
  const api_url = localStorageGet('api_url');
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const headers = { 'Content-Type': 'application/json' } as { 'Content-Type': string; Authorization?: string };

  if (!api_url || !jwt_payload) {
    document.dispatchEvent(error);
    return { success: false };
  }

  if (requestData.method !== 'checkLogin') {
    headers['Authorization'] = `Bearer ${jwt_token}`;
  }

  if (userId.length > 0) {
    userId.forEach((field) => {
      requestData.arguments[field] = jwt_payload?.user_id;
    });
  }

  try {
    const data = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    };

    const request = await fetch(`${api_url}/api/controllers/model.php?${requestData.method}`, data);

    const response = await request.json();

    if (!response.success) {
      if ('online_mode' in response && response.online_mode === 0) {
        if (window.location.pathname !== '/offline') window.location.href = '/offline';
      } else {
        document.dispatchEvent(error);
      }
    }

    return response;
  } catch (e) {
    document.dispatchEvent(error);
    return { success: false };
  }
};
