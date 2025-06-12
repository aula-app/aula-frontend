const isDev = import.meta.env.DEV;

export interface RuntimeConfig {
  API_URL: string;
  IS_MULTI: boolean;
  MULTI_URL: string;
  OAUTH_ENABLED: boolean;
  BASENAME: string;
}

const defaultConfig: RuntimeConfig = {
  API_URL: 'https://neu.aula.de/',
  IS_MULTI: false,
  MULTI_URL: 'https://neu.aula.de/instances',
  OAUTH_ENABLED: false,
  BASENAME: '/',
};

let config: RuntimeConfig;

export async function loadConfig() {
  if (isDev) {
    config = {
      API_URL: import.meta.env.VITE_APP_API_URL,
      IS_MULTI: import.meta.env.VITE_APP_MULTI !== 'false' && import.meta.env.VITE_APP_MULTI !== false,
      MULTI_URL: import.meta.env.VITE_APP_MULTI_AULA,
      OAUTH_ENABLED: import.meta.env.VITE_APP_OAUTH != 'false' && import.meta.env.VITE_APP_OAUTH !== false,
      BASENAME: import.meta.env.VITE_APP_BASENAME,
    };
  } else {
    const res = await fetch('/config.json');
    const json = await res.json();
    config = { ...defaultConfig, ...json };
  }

  return config;
}

export function getConfig(): RuntimeConfig {
  return config ?? loadConfig();
}
