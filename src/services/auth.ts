import { LoginFormValues, LoginResponseType } from '@/types/Auth';

export const loginUser = async (
  apiUrl: string,
  formData: LoginFormValues,
  token: string | null,
  signal: AbortSignal
): Promise<LoginResponseType> => {
  try {
    const response = await fetch(`${apiUrl}/api/controllers/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(formData),
      signal,
    });

    if (!response.ok) {
      throw new Error('NetworkError');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};
