import { ObjectPropByName } from '@/types/Generics';
import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

export interface RequestObject {
  model: string;
  method: string;
  arguments: ObjectPropByName;
}

export const databaseRequest = async (requestData: RequestObject, userId = [] as string[]) => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const headers = {} as { 'Content-Type'?: string; Authorization?: string };
  headers['Content-Type'] = 'application/json';

  const error = new CustomEvent('AppErrorDialog', {
    detail: 'texts.error',
  });

  if (requestData.method !== 'checkLogin') {
    headers['Authorization'] = `Bearer ${jwt_token}`;
  }

  if (userId.length > 0) {
    userId.forEach((field) => {
      requestData.arguments[field] = jwt_payload?.user_id;
    });
  }

  try {
    const response = await (
      await fetch(`${import.meta.env.VITE_APP_API_URL}/api/controllers/model.php?${requestData.method}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
      })
    ).json();

    if (response && response.success) {
      return response;
    } else {
      if ('online_mode' in response && response.online_mode === 0) {
        if (window.location.pathname !== '/offline') window.location.href = '/offline';
      } else {
        document.dispatchEvent(error);
        return response;
      }
    }
  } catch (e) {
    document.dispatchEvent(error);
    return { success: false };
  }
};
