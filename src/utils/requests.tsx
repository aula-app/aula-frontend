import { ObjectPropByName } from '@/types/Generics';
import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';
import { useAppStore } from '@/store';
import { useTranslation } from 'react-i18next';

interface RequestObject {
  model: string;
  method: string;
  arguments: ObjectPropByName;
}

export const databaseRequest = async (requestData: RequestObject, userId = [] as string[]) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();
  const jwt_token = localStorageGet('token');
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
      await fetch(`${import.meta.env.VITE_APP_API_URL}/api/controllers/model.php`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
      })
    ).json();

    if (response && response.success) {
      return response;
    } else {
      dispatch({ type: 'ADD_POPUP', message: { message: t('texts.error'), type: 'error' } });
      return response;
    }
  } catch (e) {
    dispatch({ type: 'ADD_POPUP', message: { message: t('texts.error'), type: 'error' } });
    return null;
  }
};
