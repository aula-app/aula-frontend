import { useCallback } from 'react';
import { useAppStore } from '../store';
import { localStorageGet, localStorageDelete } from '../utils/localStorage';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to detect is current user authenticated or not
 * @returns {boolean} true if user is authenticated, false otherwise
 */
export function useIsAuthenticated() {
  const [state] = useAppStore();
  let result = state.isAuthenticated;

  // TODO: AUTH: add access token verification or other authentication check here
  result = Boolean(localStorageGet('token', ''));

  return result;
}

/**
 * Returns event handler to Logout current user
 * @returns {function} calling this event logs out current user
 */
export function useEventLogout() {
  const [, dispatch] = useAppStore();
  const navigate = useNavigate()

  return useCallback(() => {
    localStorageDelete('token');

    dispatch({ type: 'LOG_OUT' });
    navigate('/')
  }, [dispatch, navigate]);
}
