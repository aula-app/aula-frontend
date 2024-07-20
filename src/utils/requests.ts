import { ObjectPropByName } from '@/types/Generics';
import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

interface RequestObject {
  model: string;
  method: string;
  arguments: ObjectPropByName;
}

export const databaseRequest = async (requestData: RequestObject, userId = [] as string[]) => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = jwt_token ? parseJwt(jwt_token) : null;
  const headers = {} as { 'Content-Type'?: string; Authorization?: string };
  headers['Content-Type'] = 'application/json';

  if (requestData.method !== 'checkLogin') {
    headers['Authorization'] = `Bearer ${jwt_token}`;
  }

  if (userId.length > 0) {
    userId.forEach((field) => {
      requestData.arguments[field] = jwt_payload.user_id;
    });
  }

  try {
    const response = await (
      await fetch(`${import.meta.env.VITE_APP_API_URL}/api/controllers/model.php`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
      })
    ).json();

    if (response && response.success) {
      return response;
    } else {
      console.log(response.error);
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};
