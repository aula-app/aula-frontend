// Constants to detect the current runtime environment
export const IS_SERVER = typeof window === 'undefined';

export function getDataLimit(): number {
  return Math.floor((window.innerHeight - 285) / 55 - 1);
}
