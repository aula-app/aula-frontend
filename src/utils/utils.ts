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

export function getDataLimit(): number {
  return Math.floor((window.innerHeight - 285) / 55);
}
