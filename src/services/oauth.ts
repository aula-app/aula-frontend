import * as client from 'openid-client';

import { getRuntimeConfig } from '@/config';
import { LoginFormValues } from '@/types/LoginTypes';
import { secondsUntilExpiry } from '@/utils/jwt';
import { localStorageGet } from '@/utils/localStorage';
import { clearSession, getAccessToken, getRefreshToken, Session, storeSession } from './session';

const TOKEN_PATH = '/api/v2/oauth/token';

/** Refresh ahead of expiry so a request never leaves with a token that dies in flight. */
const REFRESH_LEEWAY_SECONDS = 60;

/** Fired on window when the refresh token itself is rejected, so the UI can log out. */
export const SESSION_EXPIRED_EVENT = 'session-expired';

/**
 * An error the token endpoint answered with (RFC 6749 §5.2).
 *
 * `code` is the OAuth error, e.g. `invalid_grant` for wrong credentials or a
 * spent refresh token, `access_denied` for a tenant that only allows SSO.
 */
export class OAuthError extends Error {
  constructor(
    public readonly code: string,
    description?: string
  ) {
    super(description ?? code);
    this.name = 'OAuthError';
  }
}

/**
 * Passport publishes no discovery document, so the server metadata is built
 * by hand. The client is public (no secret); the tenant travels in the same
 * header every other request uses.
 */
const buildConfig = (apiUrl: string, signal?: AbortSignal): client.Configuration => {
  const { OAUTH_CLIENT_ID } = getRuntimeConfig();

  if (!OAUTH_CLIENT_ID) {
    throw new OAuthError('invalid_client', 'OAUTH_CLIENT_ID is not configured');
  }

  const config = new client.Configuration(
    { issuer: apiUrl, token_endpoint: `${apiUrl}${TOKEN_PATH}` },
    OAUTH_CLIENT_ID,
    undefined,
    client.None()
  );

  config[client.customFetch] = (url, options) =>
    fetch(url, {
      ...options,
      // oauth4webapi types the body wider than lib.dom's BodyInit; at runtime it is URLSearchParams.
      body: options.body as BodyInit,
      signal,
      headers: {
        ...options.headers,
        'aula-instance-code': localStorageGet('code') ?? '',
        'aula-frontend-version': import.meta.env.VITE_APP_VERSION ?? 'unknown',
      },
    });

  // Local development and the e2e stack talk to the backend over plain http.
  if (apiUrl.startsWith('http:')) {
    client.allowInsecureRequests(config);
  }

  return config;
};

const toSession = (response: client.TokenEndpointResponse): Session => ({
  accessToken: response.access_token,
  refreshToken: response.refresh_token,
});

const rethrowAsOAuthError = (error: unknown): never => {
  if (error instanceof client.ResponseBodyError) {
    throw new OAuthError(error.error, error.error_description);
  }
  throw error;
};

/** Resource Owner Password Credentials grant: username and password for a session. */
export const passwordGrant = async (
  apiUrl: string,
  { username, password }: LoginFormValues,
  signal?: AbortSignal
): Promise<Session> => {
  const config = buildConfig(apiUrl, signal);
  const response = await client
    .genericGrantRequest(config, 'password', { username, password })
    .catch(rethrowAsOAuthError);

  return toSession(response);
};

/** Refresh Token grant. Passport rotates: the token passed in is spent afterwards. */
export const refreshGrant = async (apiUrl: string, refreshToken: string): Promise<Session> => {
  const config = buildConfig(apiUrl);
  const response = await client.refreshTokenGrant(config, refreshToken).catch(rethrowAsOAuthError);

  return toSession(response);
};

let inflightRefresh: Promise<string | null> | null = null;

/**
 * Exchange the stored refresh token for a new session.
 *
 * Concurrent callers share one request: rotation spends the refresh token on
 * first use, so a second request racing it would be refused and log the user
 * out. Resolves to the new access token, or null when there is nothing to
 * refresh with or the server rejected the refresh token, in which case the
 * session is cleared and SESSION_EXPIRED_EVENT fired.
 */
export const refreshSession = (): Promise<string | null> => {
  if (inflightRefresh) return inflightRefresh;

  inflightRefresh = (async () => {
    const apiUrl = localStorageGet('api_url');
    const refreshToken = getRefreshToken();

    if (!apiUrl || !refreshToken) return null;

    try {
      const session = await refreshGrant(apiUrl, refreshToken);
      storeSession(session);

      return session.accessToken;
    } catch (error) {
      if (!(error instanceof OAuthError)) throw error;

      clearSession();
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));

      return null;
    } finally {
      inflightRefresh = null;
    }
  })();

  return inflightRefresh;
};

/**
 * The access token to send with the next request, refreshed first when it is
 * about to expire. Sessions without a refresh token are returned as they are.
 */
export const getFreshAccessToken = async (): Promise<string | null> => {
  const token = getAccessToken();

  if (!token || !getRefreshToken()) return token;

  const remaining = secondsUntilExpiry(token);

  if (remaining === null || remaining > REFRESH_LEEWAY_SECONDS) return token;

  return (await refreshSession()) ?? token;
};
