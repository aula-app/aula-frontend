import { useEffect, useRef, useState } from 'react';
import { versionsRequest } from '@/services/requests-v2';
import { localStorageGet } from '@/utils';
import { isVersionBelowRecommended, isVersionOutdated } from '@/utils/version';

interface OutdatedState {
  isCheckingOutdated: boolean;
  isBelowRecommended: boolean;
  isOutdated: boolean;
}

const INITIAL_STATE: OutdatedState = {
  isCheckingOutdated: true,
  isBelowRecommended: false,
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
          setState({ isCheckingOutdated: false, isBelowRecommended: false, isOutdated: false });
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
        console.log('Current version:', currentVersion);
        console.log('Received versions from backend:', versions);

        const minimumVersion = versions?.['aula-backend.v1']?.['aula-frontend']?.minimum;
        const recommendedVersion = versions?.['aula-backend.v1']?.['aula-frontend']?.recommended;

        if (recommendedVersion && recommendedVersion !== 'unknown') {
          setState((prev) => ({
            ...prev,
            isBelowRecommended: isVersionBelowRecommended(currentVersion, recommendedVersion),
          }));
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
        setState({ isCheckingOutdated: false, isBelowRecommended: false, isOutdated: false });
      }
    };

    checkIsOutdated();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  console.log(state);
  return state;
};
