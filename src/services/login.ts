import { LoginFormValues, LoginResponseType } from '@/types/LoginTypes';
import { localStorageGet } from '../utils/localStorage';
import { baseRequest, GenericResponse } from './requests';

export const loginUser = async (
  apiUrl: string,
  formData: LoginFormValues,
  token: string | null,
  signal: AbortSignal
): Promise<LoginResponseType> => {
  const api_url = localStorageGet('api_url');

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

export const checkPasswordKey = async (secret: string) => {
  const api_url = localStorageGet('api_url');

  try {
    const response = await fetch(`${api_url}/api/controllers/set_password.php?secret=${secret}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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

  const formData = {
    "secret": secret,
    "password": password
  }
  try {
    const response = await fetch(`${api_url}/api/controllers/set_password.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
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
