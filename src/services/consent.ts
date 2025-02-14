import { ConsentResponse } from '@/types/LoginTypes';
import { localStorageGet, parseJwt } from '@/utils';
const api_url = localStorageGet('api_url');
const jwt_token = localStorageGet('token');
const jwt_payload = parseJwt(jwt_token);

export const getUserConsent = async (token: string, signal?: AbortSignal): Promise<ConsentResponse> => {
  try {
    const response = await fetch(`${api_url}/api/controllers/user_consent.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    if (!response.ok) {
      throw new Error('NetworkError');
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};

export interface MessageConsentType {
  id: number;
  headline: string;
  body: string;
  consent_text: string;
  consent?: number;
}

export const getNecessaryConsents = async () => {
  const response = await (
    await fetch(api_url + '/api/controllers/get_necessary_consents.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt_token,
      },
    })
  ).json();

  return response.data as MessageConsentType[];
};

export const giveConsent = async (text_id: number) => {
  if (!jwt_payload) return;
  const response = await (
    await fetch(api_url + '/api/controllers/give_consent.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt_token,
      },
      body: JSON.stringify({ text_id, user_id: jwt_payload.user_id }),
    })
  ).json();

  return response.data;
};
