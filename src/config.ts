const isDev = import.meta.env.DEV;
const isMobile = import.meta.env.MODE === 'app';

export interface RuntimeConfig {
  CENTRAL_API_URL: string;
  IS_MULTI: boolean;
  IS_OAUTH_ENABLED: boolean;
  BASENAME: string;
}

export const defaultConfig: RuntimeConfig = {
  CENTRAL_API_URL: 'https://neu.aula.de/',
  IS_MULTI: true,
  IS_OAUTH_ENABLED: false,
  BASENAME: '/',
};

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  let config: RuntimeConfig;

  if (isDev || isMobile) {
    config = {
      CENTRAL_API_URL: import.meta.env.VITE_APP_API_URL,
      IS_MULTI: import.meta.env.VITE_APP_MULTI !== 'false' && import.meta.env.VITE_APP_MULTI !== false,
      IS_OAUTH_ENABLED: import.meta.env.VITE_APP_OAUTH !== 'false' && import.meta.env.VITE_APP_OAUTH !== false,
      BASENAME: import.meta.env.VITE_APP_BASENAME || '/',
    };
  } else {
    const res = await fetch('/public-config.json');
    const json = await res.json();
    config = { ...defaultConfig, ...json };
  }

  localStorage.setItem('config', JSON.stringify(config));
  return config;
}

export class RuntimeConfigNotFoundError extends Error {}

export function getRuntimeConfig(): RuntimeConfig {
  const config = localStorage.getItem('config');
  if (config === null) throw new RuntimeConfigNotFoundError();
  return JSON.parse(config);
}
