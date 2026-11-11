const isDev = import.meta.env.DEV;
const isMobile = import.meta.env.MODE === 'app';

export const APP_TITLE = 'aula';

export interface RuntimeConfig {
  CENTRAL_API_URL: string;
  IS_MULTI: boolean;
  BASENAME: string;
  /** Passport password-grant client id, shared by every tenant of this deployment. */
  OAUTH_CLIENT_ID: string;
}

const defaultConfig: RuntimeConfig = {
  CENTRAL_API_URL: 'https://neu.aula.de/',
  IS_MULTI: true,
  BASENAME: '/',
  OAUTH_CLIENT_ID: '',
};

/** Root index.ts runs async loadRuntimeConfig before *everything* (root React render),
 * usually getRuntimeConfig() should do,
 * but there are only few cases where we need to call it explicitly:
 * - SetPasswordView.tsx needs to do some juggling because it needs to figure out the instance it checks against
 * - instance.ts validateAndSaveInstanceCode, questionably?
 */
export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  let config: RuntimeConfig;

  if (isDev || isMobile) {
    config = {
      CENTRAL_API_URL: import.meta.env.VITE_APP_API_URL,
      IS_MULTI: import.meta.env.VITE_APP_MULTI !== 'false' && import.meta.env.VITE_APP_MULTI !== false,
      BASENAME: import.meta.env.VITE_APP_BASENAME || '/',
      OAUTH_CLIENT_ID: import.meta.env.VITE_APP_OAUTH_CLIENT_ID || '',
    };
  } else {
    const branchBasename = import.meta.env.VITE_APP_BASENAME || '/';
    const res = await fetch(`${branchBasename}public-config.json`, {
      headers: { 'aula-frontend-version': process.env.VITE_APP_VERSION ?? 'unknown' },
    });
    const json = await res.json();
    config = { ...defaultConfig, ...json };
  }

  localStorage.setItem('config', JSON.stringify(config));
  return config;
}

export class RuntimeConfigNotFoundError extends Error { }

export function getRuntimeConfig(): RuntimeConfig {
  const config = localStorage.getItem('config');
  if (config === null) throw new RuntimeConfigNotFoundError();
  return JSON.parse(config);
}
