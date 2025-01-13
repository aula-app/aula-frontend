export const recoverPassword = async (
  apiUrl: string,
  email: string,
  token: string | null,
  signal: AbortSignal
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${apiUrl}/api/controllers/forgot_password.php?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
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
