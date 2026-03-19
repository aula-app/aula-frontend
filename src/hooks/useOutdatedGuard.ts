import { useEffect, useRef, useState } from 'react';
import { versionsRequest } from '@/services/requests-v2';
import { localStorageGet } from '@/utils';
import { isVersionOutdated } from '@/utils/version';

interface OutdatedState {
  isCheckingOutdated: boolean;
  isRecommended: boolean;
  isOutdated: boolean;
}

const INITIAL_STATE: OutdatedState = {
  isCheckingOutdated: true,
  isRecommended: false,
  isOutdated: false,
};

export const useOutdatedGuard = (refreshKey?: string): OutdatedState => {
  const [state, setState] = useState<OutdatedState>(INITIAL_STATE);
  const lastCheckedRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkIsOutdated = async () => {
      const apiUrl = localStorageGet('api_url');
      const currentVersion = import.meta.env?.VITE_APP_VERSION ?? 'unknown';

      if (!apiUrl || currentVersion === 'unknown') {
        if (isMounted) {
          setState({ isCheckingOutdated: false, isRecommended: false, isOutdated: false });
        }
        return;
      }

      const cacheKey = `${apiUrl}:${currentVersion}`;
      if (lastCheckedRef.current === cacheKey) {
        setState((prev) => ({ ...prev, isCheckingOutdated: false }));
        return;
      }

      try {
        if (!isMounted) return;

        const versions = await versionsRequest();

        const minimumVersion = versions?.['aula-backend.v2']?.['aula-frontend']?.minimum;
        const recommendedVersion = versions?.['aula-backend.v2']?.['aula-frontend']?.recommended;

        if (recommendedVersion && recommendedVersion !== 'unknown') {
          setState((prev) => ({ ...prev, isRecommended: isVersionOutdated(currentVersion, recommendedVersion) }));
        }

        if (minimumVersion && minimumVersion !== 'unknown') {
          setState((prev) => ({ ...prev, isOutdated: isVersionOutdated(currentVersion, minimumVersion) }));
          return;
        }

        lastCheckedRef.current = cacheKey;
        setState((prev) => ({ ...prev, isCheckingOutdated: false }));
      } catch (error) {
        if (!isMounted) return;
        console.error('Failed to verify frontend version against backend requirements.', error);
        setState({ isCheckingOutdated: false, isRecommended: false, isOutdated: false });
      }
    };

    checkIsOutdated();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return state;
};
