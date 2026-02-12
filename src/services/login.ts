import { LoginFormValues, LoginResponseType } from '@/types/LoginTypes';
import { localStorageGet } from '../utils/localStorage';

export const loginUser = async (
  apiUrl: string,
  formData: LoginFormValues,
  token: string | null,
  signal: AbortSignal
): Promise<LoginResponseType> => {
  const api_code = localStorageGet('code');

  try {
    const response = await fetch(`${apiUrl}/api/controllers/login.php`, {
      method: 'POST',
      headers: {
        'aula-instance-code': api_code,
        'aula-frontend-version': import.meta?.env?.VITE_APP_VERSION ?? process?.env?.VITE_APP_VERSION,
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

export const checkPasswordKey = async (secret: string) => {
  const instanceApiUrl = localStorageGet('api_url');
  const code = localStorageGet('code');

  try {
    const params = new URLSearchParams({ secret });
    const response = await fetch(`${instanceApiUrl}/api/controllers/set_password.php?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'aula-instance-code': code,
        'aula-frontend-version': import.meta?.env?.VITE_APP_VERSION ?? process?.env?.VITE_APP_VERSION,
      },
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

export const setPassword = async (password: string, secret: string) => {
  const api_url = localStorageGet('api_url');
  const api_code = localStorageGet('code');

  const formData = {
    secret: secret,
    password: password,
  };
  try {
    const response = await fetch(`${api_url}/api/controllers/set_password.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'aula-instance-code': api_code,
        'aula-frontend-version': import.meta?.env?.VITE_APP_VERSION ?? process?.env?.VITE_APP_VERSION,
      },
      body: JSON.stringify(formData),
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

const logout = () => {
  // Perform any cleanup needed for logout
  localStorage.clear();
  sessionStorage.clear();
};

export const recoverPassword = async (
  apiUrl: string,
  email: string,
  token: string | null,
  signal: AbortSignal
): Promise<{ success: boolean }> => {
  const api_code = localStorageGet('code');

  try {
    const params = new URLSearchParams({ email });
    const response = await fetch(`${apiUrl}/api/controllers/forgot_password.php?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        'aula-instance-code': api_code,
        'aula-frontend-version': import.meta?.env?.VITE_APP_VERSION ?? process?.env?.VITE_APP_VERSION,
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
