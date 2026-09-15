import { getSsoStatus } from '@/services/sso';
import { localStorageGet } from '@/utils';
import { useEffect, useState } from 'react';

export function useSsoManaged(): boolean {
  const [managed, setManaged] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('sso_managed_override') === 'true') {
      setManaged(true);
      return;
    }

    const apiUrl = localStorageGet('api_url');
    if (!apiUrl) return;

    let cancelled = false;

    getSsoStatus(apiUrl).then((status) => {
      if (!cancelled) setManaged(status?.enabled === true && status.provider !== null);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return managed;
}
