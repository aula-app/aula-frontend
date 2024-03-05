import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

interface Header {
  'Content-Type': 'application/json';
  'Authorization'?: string;
}

const jwt_token = localStorageGet('token');
const jwt_payload = jwt_token ? parseJwt(jwt_token) : null;

export const databaseRequest = async (table: string, requestData: Object) => {
  const header = new Headers();
  header.set('Content-Type', 'application/json');
  if(table !== 'login') header.set('Authorization', `Bearer ${jwt_token}`);
  if(table !== 'login') requestData = {...requestData, user_id: jwt_payload.user_id};

  if (!jwt_payload) return null;
  try {
    const response = await (
      await fetch(`${import.meta.env.VITE_APP_API_URL}/api/controllers/${table}.php`, {
        method: 'POST',
        headers: header,
        body: JSON.stringify(
          requestData
        ),
      })
    ).json();

    if (response && response.success) {
      return response;
    } else {
      console.log('failed');
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};
