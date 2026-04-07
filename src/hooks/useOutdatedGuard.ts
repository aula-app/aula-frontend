import { useEffect, useRef, useState } from 'react';
import { versionsRequest } from '@/services/requests-v2';
import { localStorageGet } from '@/utils';
import { isVersionBelowRecommended, isVersionOutdated } from '@/utils/version';
import { useAppStore } from '@/store';
import { useTranslation } from 'react-i18next';

interface OutdatedState {
  isCheckingOutdated: boolean;
  isBelowRecommended: boolean;
  isOutdated: boolean;
}

const LAST_CHECK_TTL_MS = 10 * 60 * 1000; // 10 minutes

const INITIAL_STATE: OutdatedState = {
  isCheckingOutdated: true,
  isBelowRecommended: false,
  isOutdated: false,
};

export const useOutdatedGuard = (refreshKey?: string): OutdatedState => {
  const [state, setState] = useState<OutdatedState>(INITIAL_STATE);
  const lastCheckedRef = useRef<{ key: string; timestamp: number } | null>(null);
  const popupShownRef = useRef<boolean>(false);
  const [, dispatch] = useAppStore();
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;

    const checkIsOutdated = async () => {
      const apiUrl = localStorageGet('api_url');
      const currentVersion = import.meta.env?.VITE_APP_VERSION ?? 'unknown';

      if (!apiUrl || currentVersion === 'unknown') {
        if (isMounted) {
          setState({ isCheckingOutdated: false, isBelowRecommended: false, isOutdated: false });
        }
        return;
      }

      const cacheKey = `${apiUrl}:${currentVersion}`;
      const now = Date.now();
      if (lastCheckedRef.current?.key === cacheKey && now - lastCheckedRef.current.timestamp < LAST_CHECK_TTL_MS) {
        setState((prev) => ({ ...prev, isCheckingOutdated: false }));
        return;
      }

      try {
        if (!isMounted) return;

        const versions = await versionsRequest();

        let outdated = false;

        const minimumVersion = versions?.['aula-backend.v2']?.['aula-frontend']?.minimum;
        const recommendedVersion = versions?.['aula-backend.v2']?.['aula-frontend']?.recommended;

        if (minimumVersion && minimumVersion !== 'unknown') {
          outdated = isVersionOutdated(currentVersion, minimumVersion);
          setState((prev) => ({ ...prev, isOutdated: outdated }));
        }

        if (recommendedVersion && recommendedVersion !== 'unknown') {
          const belowRecommended = isVersionBelowRecommended(currentVersion, recommendedVersion);
          setState((prev) => ({ ...prev, isBelowRecommended: belowRecommended }));
          if (belowRecommended && !outdated && !popupShownRef.current) {
            dispatch({
              action: 'ADD_POPUP',
              message: {
                type: 'info',
                message: t('errors.appBelowRecommended', {
                  currentVersion,
                  recommendedVersion,
                }),
              },
            });
            popupShownRef.current = true;
          }
        }

        lastCheckedRef.current = { key: cacheKey, timestamp: now };
        setState((prev) => ({ ...prev, isCheckingOutdated: false }));
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to verify frontend version against backend requirements.', error);
        setState({ isCheckingOutdated: false, isBelowRecommended: false, isOutdated: false });
      }
    };

    checkIsOutdated();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return state;
};
