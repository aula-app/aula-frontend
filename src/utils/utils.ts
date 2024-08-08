import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

export const IS_SERVER = typeof window === 'undefined';
export const IS_BROWSER = typeof window !== 'undefined' && typeof window?.document !== 'undefined';
/* eslint-disable no-restricted-globals */
export const IS_WEBWORKER =
  typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
/* eslint-enable no-restricted-globals */

const jwt = localStorageGet('token');
const user = parseJwt(jwt);

export function getCurrentVersion(): string {
  return import.meta.env?.npm_package_version ?? import.meta.env.VITE_APP_VERSION ?? 'unknown';
}

export function getCurrentEnvironment(): string {
  return import.meta.env?.NODE_ENV ?? 'development';
}

export function getCurrentUser(): number {
  if (!jwt) return 0;
  return user.user_id;
}

export function checkPermissions(role: number): boolean {
  if (!jwt) return false;
  return user.user_level >= role;
}

export function checkSelf(id: number): boolean {
  if (!jwt) return false;
  return user.user_id === id;
}
