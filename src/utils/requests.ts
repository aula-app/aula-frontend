import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

export const databaseRequest = async (controllerName: string, requestData: Object) => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = jwt_token ? parseJwt(jwt_token) : null;
  const headers = {} as {'Content-Type'?: string, 'Authorization'?: string};
  headers['Content-Type'] = 'application/json';

  if(controllerName !== 'login')  {
    headers['Authorization'] = `Bearer ${jwt_token}`;
    if (!jwt_payload) return null;
  }

  try {
    const response = await (
      await fetch(`${import.meta.env.VITE_APP_API_URL}/api/controllers/${controllerName}.php`, {
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