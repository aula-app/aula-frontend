import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

const jwt_token = localStorageGet('token');
const jwt_payload = jwt_token ? parseJwt(jwt_token) : null;

export const databaseRequest = async (table: string, requestData: Object) => {
  if (!jwt_payload) return false;
  try {
    const response = await (
      await fetch(`${import.meta.env.VITE_APP_API_URL}/api/controllers/${table}.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt_token,
      },
      body: JSON.stringify({
        user_id: jwt_payload.user_id,
        ...requestData,
      }),
    })).json();

    if (response && response.success) {
      return true;
    } else {
      console.log('error');
      return false;
    }
  } catch (e) {
    console.log(e)
    return false;
  }
};
