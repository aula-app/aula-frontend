import { localStorageSet } from '@/utils';

export const handleOAuthLogin = (token: string | undefined) => {
  if (!token) {
    throw new Error('No token provided');
  }
  localStorageSet('token', token);
  return true;
};
