import { getSsoStatus, SsoStatus } from '@/services/sso';
import { localStorageGet } from '@/utils';
import { useEffect, useState } from 'react';

/**
 * Rechecked when `instanceCode` changes. `undefined` until the first answer;
 * `null` if the backend can't answer or a new code is being checked.
 * Polls until useInstanceGuard has written api_url.
 */
export function useSsoStatus(instanceCode?: string): SsoStatus | null | undefined {
  const [result, setResult] = useState<{ instanceCode?: string; status: SsoStatus | null }>();

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

      const status = await getSsoStatus(apiUrl);
      if (!cancelled) setResult({ instanceCode, status });
    };

    check();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [instanceCode]);

  if (!result) return undefined;
  return result.instanceCode === instanceCode ? result.status : null;
}
