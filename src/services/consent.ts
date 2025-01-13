import { ConsentResponse } from '@/types/LoginTypes';

export const getUserConsent = async (apiUrl: string, token: string, signal?: AbortSignal): Promise<ConsentResponse> => {
  try {
    const response = await fetch(`${apiUrl}/api/controllers/user_consent.php`, {
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
