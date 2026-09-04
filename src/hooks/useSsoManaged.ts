import { useSsoStatus } from './useSsoStatus';

export function useSsoManaged(): boolean {
  const status = useSsoStatus();

  if (typeof window !== 'undefined' && localStorage.getItem('sso_managed_override') === 'true') {
    return true;
  }

  return status?.enabled === true && status.provider !== null;
}
