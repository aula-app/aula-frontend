import { getSsoStatus } from '@/services/sso';
import { localStorageGet } from '@/utils';
import { useEffect, useState } from 'react';

export function useSsoRequired(): boolean {
  const [required, setRequired] = useState(false);

  useEffect(() => {
    const apiUrl = localStorageGet('api_url');
    if (!apiUrl) return;

    let cancelled = false;

    getSsoStatus(apiUrl).then((status) => {
      if (!cancelled) setRequired(status?.enabled === true && status.provider !== null && status.required === true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return required;
}
