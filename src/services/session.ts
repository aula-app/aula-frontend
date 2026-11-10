/**
 * The OAuth2 session issued by /api/v2/oauth/token.
 *
 * The access token is kept under the historical `token` key: the e2e fixtures
 * and the native deep-link handler both wait on it, and a few readers still
 * parse its claims directly.
 */

const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export interface Session {
  accessToken: string;
  /** Absent for sessions the SSO callback hands over, which carry no refresh token yet. */
  refreshToken?: string;
}

// Raw localStorage access on purpose: the shared helper JSON-parses values,
// which would turn a purely numeric token into a number.
export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);

export const storeSession = ({ accessToken, refreshToken }: Session): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const clearSession = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
