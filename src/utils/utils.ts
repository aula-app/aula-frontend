import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

export const IS_SERVER = typeof window === 'undefined';
export const IS_BROWSER = typeof window !== 'undefined' && typeof window?.document !== 'undefined';
/* eslint-disable no-restricted-globals */
export const IS_WEBWORKER =
  typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
/* eslint-enable no-restricted-globals */

export function getCurrentVersion(): string {
  return import.meta.env?.npm_package_version ?? import.meta.env.VITE_APP_VERSION ?? 'unknown';
}

export function getCurrentEnvironment(): string {
  return import.meta.env?.NODE_ENV ?? 'development';
}

export function getCurrentUser(): number {
  const jwt = localStorageGet('token');
  const user = !!jwt ? parseJwt(jwt) : false;

  if (!user) return 0;
  return user.user_id;
}

export function checkPermissions(role: number): boolean {
  const jwt = localStorageGet('token');
  const user = !!jwt ? parseJwt(jwt) : false;

  if (!user) return false;
  return user.user_level >= role;
}

// export function checkRoutesPermissions(role: number, route: string): boolean {
//   const ROUTES_PERMISSIONS = {
//     'boxes': 30
//   }
//   const jwt = localStorageGet('token');
//   const user = !!jwt ? parseJwt(jwt) : false;
//
//   if (!user) return false;
//   return (user.user_level >= ROUTES_PERMISSIONS[route]);
// }

export function checkSelf(id: number): boolean {
  const jwt = localStorageGet('token');
  const user = !!jwt ? parseJwt(jwt) : false;

  if (!user) return false;
  return user.user_id === id;
}
