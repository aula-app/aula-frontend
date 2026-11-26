import { getSsoStatus, SsoStatus } from '@/services/sso';
import { localStorageGet } from '@/utils';
import { useEffect, useState } from 'react';

/**
 * The instance's SSO status, checked again whenever `instanceCode` changes.
 *
 * `undefined` until the first answer (callers gate rendering instead of failing
 * open); `null` when the backend could not answer, or while a new instance code
 * is being checked. api_url is written asynchronously by useInstanceGuard — and
 * only once the user enters their code in multi-instance mode — so poll for it
 * before querying.
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
