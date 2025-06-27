import { localStorageDelete, localStorageSet } from '@/utils';
import { Dispatch } from 'react';
import { baseRequest } from './requests';

export const clearAuth = (dispatch: Dispatch<{ type: string }>) => {
  localStorageDelete('token');
  dispatch({ type: 'LOG_OUT' });
};

export const handleOAuthLogin = (token: string | undefined) => {
  if (!token) {
    throw new Error('No token provided');
  }
  localStorageSet('token', token);
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
