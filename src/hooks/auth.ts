import { useAppStore } from '@/store';
import { checkPermissions, databaseRequest, localStorageDelete, localStorageGet } from '@/utils';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to detect is current user authenticated or not
 * @returns {boolean} true if user is authenticated, false otherwise
 */
export function useIsAuthenticated() {
  const [state] = useAppStore();
  let result = state.isAuthenticated;

  // TODO: AUTH: add access token verification or other authentication check here
  result = Boolean(localStorageGet('token'));

  return result;
}

export async function useIsOnline(): Promise<boolean> {
  let isOnline = true;
  await databaseRequest({
    model: 'Settings',
    method: 'getInstanceSettings',
    arguments: {},
  }).then((response) => {
    if (!response.data) return false;
    isOnline =
      response.data['online_mode'] === 1 ||
      (checkPermissions('system', 'access') && response.data['online_mode'] !== 5);
  });
  return isOnline;
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
