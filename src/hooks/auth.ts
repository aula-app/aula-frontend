import { databaseRequest } from '@/services/requests';
import { useAppStore } from '@/store';
import { InstanceResponse } from '@/types/Generics';
import { checkPermissions, localStorageDelete, localStorageGet } from '@/utils';
import { parseJwt } from '@/utils/jwt';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to detect is current user authenticated or not
 * @returns {boolean} true if user is authenticated, false otherwise
 */
export function useIsAuthenticated() {
  const [state] = useAppStore();
  let result = state.isAuthenticated;

  // Verify token exists and is valid
  const token = localStorageGet('token');
  if (token) {
    const payload = parseJwt(token);

    // Check if token is valid and not expired
    if (payload && typeof payload.exp === 'number') {
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
