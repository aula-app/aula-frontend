import { parseJwt } from './jwt';
import { localStorageGet } from './localStorage';

// Constants to detect the current runtime environment
export const IS_SERVER = typeof window === 'undefined';
export const IS_BROWSER = typeof window !== 'undefined' && typeof window?.document !== 'undefined';
/* eslint-disable no-restricted-globals */
// Detects if code is running in a Web Worker context by checking the self object
export const IS_WEBWORKER =
  typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope';
/* eslint-enable no-restricted-globals */

/**
 * Retrieves the current application version from environment variables
 * Checks npm_package_version first, falls back to VITE_APP_VERSION, defaults to 'unknown'
 * @returns {string} The current version of the application
 */
export function getCurrentVersion(): string {
  return import.meta.env?.npm_package_version ?? import.meta.env.VITE_APP_VERSION ?? 'unknown';
}

/**
 * Gets the current environment (development, production, etc.)
 * Falls back to 'development' if NODE_ENV is not set
 * @returns {string} The current environment name
 */
export function getCurrentEnvironment(): string {
  return import.meta.env?.NODE_ENV ?? 'development';
}

/**
 * Retrieves the current user's ID from the JWT token stored in localStorage
 * @returns {number} The user ID if authenticated, 0 if not authenticated
 */
export function getCurrentUser(): number {
  const jwt = localStorageGet('token');
  const user = !!jwt ? parseJwt(jwt) : false;

  if (!user) return 0;
  return user.user_id;
}

/**
 * Checks if the current user has sufficient permissions for a given role level
 * @param {number} role - The minimum role level required
 * @returns {boolean} True if user has sufficient permissions, false otherwise
 */
export function checkPermissions(role: number): boolean {
  const jwt = localStorageGet('token');
  const user = !!jwt ? parseJwt(jwt) : false;

  if (!user) return false;
  return user.user_level >= role;
}

/**
 * Verifies if the current user matches a specific user ID
 * Used for checking if the user is accessing their own resources
 * @param {number} id - The user ID to check against
 * @returns {boolean} True if current user matches the ID, false otherwise
 */
export function checkSelf(id: number): boolean {
  const jwt = localStorageGet('token');
  const user = !!jwt ? parseJwt(jwt) : false;

  if (!user) return false;
  return user.user_id === id;
}
