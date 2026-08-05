import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { localStorageGet, localStorageSet } from '@/utils';
import { getRuntimeConfig } from '@/config';

/**
 * Ensures the correct instance configuration exists before rendering public routes.
 */
export const useInstanceGuard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const ensureInstanceConfiguration = async () => {
      const instanceCode = localStorageGet('code', false);
      const { IS_MULTI, CENTRAL_API_URL } = getRuntimeConfig();

      if (IS_MULTI) {
        if (!instanceCode && location.pathname !== '/code') {
          // Preserve query string (e.g. ?via=eduplaces&login_hint=…) so
          // InstanceCodeView can resume the IdP-initiated hand-off after
          // the user enters their instance code.
          navigate(`/code${location.search}`);
        }
        return;
      }

      localStorageSet('code', 'SINGLE');
      await localStorageSet('api_url', CENTRAL_API_URL);
    };

    ensureInstanceConfiguration();
  }, [location.pathname, navigate]);
};
