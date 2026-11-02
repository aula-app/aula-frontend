import { useEffect } from 'react';
import { localStorageSet } from '@/utils';
import { getRuntimeConfig } from '@/config';

/**
 * Ensures the correct instance configuration exists before rendering public routes.
 */
export const useInstanceGuard = () => {
  useEffect(() => {
    const ensureInstanceConfiguration = async () => {
      const { IS_MULTI, CENTRAL_API_URL } = getRuntimeConfig();

      // Multi-instance entry is inline on the public forms (InstanceCodeField),
      // which persist the code and api_url themselves.
      if (IS_MULTI) return;

      localStorageSet('code', 'SINGLE');
      await localStorageSet('api_url', CENTRAL_API_URL);
    };

    ensureInstanceConfiguration();
  }, []);
};
