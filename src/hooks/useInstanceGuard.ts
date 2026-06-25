import { useEffect } from 'react';
import { localStorageSet } from '@/utils';
import { getRuntimeConfig } from '@/config';

/**
 * For single-instance deployments, seeds localStorage with the default code/url so
 * the rest of the app can read them without special-casing IS_MULTI everywhere.
 */
export const useInstanceGuard = () => {
  useEffect(() => {
    const { IS_MULTI, CENTRAL_API_URL } = getRuntimeConfig();
    if (!IS_MULTI) {
      localStorageSet('code', 'SINGLE');
      localStorageSet('api_url', CENTRAL_API_URL);
    }
  }, []);
};
