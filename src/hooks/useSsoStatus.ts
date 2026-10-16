import { getSsoStatus, SsoStatus } from '@/services/sso';
import { localStorageGet } from '@/utils';
import { useEffect, useState } from 'react';

/**
 * The instance's SSO status, fetched once.
 *
 * `undefined` while unresolved (callers gate rendering instead of failing
 * open); `null` when the backend could not answer. api_url is written
 * asynchronously by useInstanceGuard — and only once the user enters their
 * code in multi-instance mode — so poll for it before querying.
 */
export function useSsoStatus(): SsoStatus | null | undefined {
  const [status, setStatus] = useState<SsoStatus | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const check = async () => {
      if (cancelled) return;

      const apiUrl = localStorageGet('api_url');
      if (!apiUrl) {
        timer = setTimeout(check, 200);
        return;
      }

      const result = await getSsoStatus(apiUrl);
      if (!cancelled) setStatus(result);
    };

    check();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return status;
}
