// Constants to detect the current runtime environment
export const IS_SERVER = typeof window === 'undefined';

export function getDataLimit(): number {
  if (IS_SERVER) {
    return 1;
  }
  return Math.max(1, Math.floor((window.innerHeight - 285) / 55 - 1));
}
