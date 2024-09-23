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
  const api_url = localStorageGet('api_url');
  const jwt_payload = parseJwt(jwt_token);
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
      await fetch(`${api_url}/api/controllers/model.php`, {
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
