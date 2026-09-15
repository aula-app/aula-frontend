import { getSsoStatus } from '@/services/sso';
import { localStorageGet } from '@/utils';
import { useEffect, useState } from 'react';

/**
 * Whether the instance mandates SSO. `undefined` while the status is still
 * being resolved, so callers can gate rendering instead of failing open.
 */
export function useSsoRequired(): boolean | undefined {
  const [required, setRequired] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    // api_url is written asynchronously by useInstanceGuard (and, in
    // multi-instance mode, only once the user enters their code), so poll for
    // it before querying rather than settling on a permissive default.
    const check = async () => {
      if (cancelled) return;

      const apiUrl = localStorageGet('api_url');
      if (!apiUrl) {
        timer = setTimeout(check, 200);
        return;
      }

      const status = await getSsoStatus(apiUrl);
      if (!cancelled) {
        setRequired(status?.enabled === true && status.provider !== null && status.required === true);
      }
    };

    check();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return required;
}
