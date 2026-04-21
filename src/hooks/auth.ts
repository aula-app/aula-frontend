import { databaseRequest } from '@/services/requests';
import { useAppStore } from '@/store';
import { InstanceResponse } from '@/types/Generics';
import { checkPermissions, localStorageDelete, localStorageGet } from '@/utils';
import { parseJwt } from '@/utils/jwt';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { getUserConsent } from '@/services/consent';

const CONSENT_REQUEST_TIMEOUT_MS = 10000;

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

/**
 * Keeps the user's consent state in sync with the backend.
 */
export const useConsentSync = (isAuthenticated: boolean, locationKey: string) => {
  const [, dispatch] = useAppStore();
  const apiUrl = localStorageGet('api_url');
  const jwtToken = localStorageGet('token');

  const fetchConsent = useCallback(async () => {
    if (!jwtToken || !apiUrl) return;

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), CONSENT_REQUEST_TIMEOUT_MS);

      const result = await getUserConsent(jwtToken, controller.signal);
      window.clearTimeout(timeoutId);

      dispatch({
        action: 'HAS_CONSENT',
        payload: result.data !== 0,
      });
    } catch (error) {
      dispatch({
        action: 'HAS_CONSENT',
        payload: false,
      });
    }
  }, [apiUrl, jwtToken, dispatch]);

  useEffect(() => {
    fetchConsent();
  }, [fetchConsent, isAuthenticated, locationKey]);
};
