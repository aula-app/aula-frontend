import { useSsoStatus } from './useSsoStatus';

/**
 * Whether the instance mandates SSO. `undefined` while the status is still
 * being resolved, so callers can gate rendering instead of failing open.
 */
export function useSsoRequired(): boolean | undefined {
  const status = useSsoStatus();

  if (status === undefined) return undefined;

  return status?.enabled === true && status.provider !== null && status.required === true;
}
