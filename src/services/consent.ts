import { databaseRequest, GenericResponse } from '@/services/requests';
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
  user_needs_to_consent: 0 | 1 | 2;
}

interface MessageConsentResponse extends GenericResponse {
  data: MessageConsentType[];
}

export async function getConsents(): Promise<MessageConsentResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'getMissingConsents',
      arguments: {},
    },
    ['user_id']
  );

  return response as MessageConsentResponse;
}

export async function giveConsent(text_id: number, consent_value: number): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'giveConsent',
      arguments: { text_id, consent_value },
    },
    ['user_id', 'updater_id']
  );

  return response as GenericResponse;
}
