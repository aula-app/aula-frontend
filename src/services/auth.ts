import { Dispatch } from 'react';
import { baseRequest } from './requests';
import { clearSession, storeSession } from './session';
import { AppAction } from '@/store/AppStore';

export const clearAuth = (dispatch: Dispatch<AppAction>) => {
  clearSession();
  dispatch({ type: 'LOG_OUT' });
};

/**
 * Store the access token the SSO callback hands over in the URL. It comes
 * without a refresh token, so such a session ends when the token expires.
 */
export const handleOAuthLogin = (token: string | undefined) => {
  if (!token) {
    throw new Error('No token provided');
  }
  storeSession({ accessToken: token });
  return true;
};

export const changePassword = async (oldPass: string, newPass: string, tmp_token?: string) => {
  return baseRequest(
    `/api/controllers/change_password.php`,
    {
      password: oldPass,
      new_password: newPass,
    },
    true,
    tmp_token
  );
};
