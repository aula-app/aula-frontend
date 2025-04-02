import { useAppStore } from '@/store';
import { checkPermissions, databaseRequest, localStorageDelete, localStorageGet, localStorageSet } from '@/utils';
import { InstanceResponse } from '@/types/Generics';
import { parseJwt } from '@/utils/jwt';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Refreshes the authentication token
 * @returns {Promise<boolean>} true if token was refreshed successfully, false otherwise
 */
export async function refreshToken(): Promise<boolean> {
  try {
    const api_url = localStorageGet('api_url');
    if (!api_url) return false;

    const response = await fetch(`${api_url}/api/controllers/refresh_token.php`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorageGet('token')}`,
      },
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (data && data.JWT) {
      localStorageSet('token', data.JWT);

      // Dispatch a custom event that React components can listen to
      const tokenRefreshEvent = new CustomEvent('token-refreshed', {
        detail: { token: data.JWT },
      });
      window.dispatchEvent(tokenRefreshEvent);

      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
}

/**
 * Hook to detect is current user authenticated or not
 * @returns {boolean} true if user is authenticated, false otherwise
 */
export function useIsAuthenticated() {
  const [state] = useAppStore();
  const logout = useEventLogout();
  let result = state.isAuthenticated;

  // Verify token exists and is valid
  const token = localStorageGet('token');

  useEffect(() => {
    if (!token) {
      // No token, user should be logged out
      logout();
      return;
    }

    const payload = parseJwt(token);
    // Check if token is valid and not expired
    if (payload && payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      // If token is expired, try to refresh it
      if (payload.exp !== 0 && payload.exp <= currentTime) {
        refreshToken().then((success) => {
          if (!success) {
            // If refresh failed, log out the user
            logout();
          }
        });
      }
    } else {
      // Invalid token payload, log out
      logout();
    }
  }, [token, logout]);

  if (token) {
    const payload = parseJwt(token);
    // Check if token is valid and not expired
    if (payload && payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      result = payload.exp === 0 || payload.exp > currentTime;
    } else {
      result = false;
    }
  } else {
    result = false;
  }

  return result;
}

export async function useIsOnline(): Promise<boolean> {
  const response = await databaseRequest<InstanceResponse>({
    model: 'Settings',
    method: 'getInstanceSettings',
    arguments: {},
  });

  if (!response.data) return false;

  return response.data.online_mode === 1 || (checkPermissions('system', 'access') && response.data.online_mode !== 5);
}

/**
 * Returns event handler to Logout current user
 * @returns {function} calling this event logs out current user
 */
export function useEventLogout() {
  const [, dispatch] = useAppStore();
  const navigate = useNavigate();

  return useCallback(() => {
    localStorageDelete('token');

    dispatch({ type: 'LOG_OUT' });
    navigate('/');
  }, [dispatch, navigate]);
}
