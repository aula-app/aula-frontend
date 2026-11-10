import { ObjectPropByName, StatusTypes } from '../types/Generics';
import { parseJwt } from '../utils/jwt';
import { localStorageGet } from '../utils/localStorage';
import { getFreshAccessToken, refreshSession } from './oauth';
import { getAccessToken } from './session';
import { t } from 'i18next';

/**
 * Interface representing a database request object.
 * @interface RequestObject
 * @property {string} model - The model/entity name to perform operations on
 * @property {string} method - The method/operation to execute (e.g., 'checkLogin')
 * @property {ObjectPropByName} arguments - Key-value pairs of arguments for the request
 */

export interface RequestObject {
  model: string;
  method: string;
  arguments: ObjectPropByName;
}

export interface GenericResponse<T = unknown> {
  data: T | null;
  count: number | null;
  error: string | null;
  error_code?: number | null;
  detail?: unknown;
}

export interface GenericListRequest {
  offset?: number;
  limit?: number;
  orderby?: number;
  asc?: 0 | 1;
  search_field?: string;
  search_text?: string;
  both_names?: string;
  status?: StatusTypes;
  user_needs_to_consent?: StatusTypes;
}

/**
 * Makes an authenticated request to the database API.
 *
 * This function handles API requests with JWT authentication, error handling, and offline mode detection.
 * It automatically includes the user ID in the request arguments when specified.
 *
 * @param {RequestObject} requestData - The request data containing model, method, and arguments
 * @param {string[]} userId - Optional array of argument field names that should be populated with the authenticated user's ID
 * @returns {Promise<{ success: boolean } & Record<string, any>>} A promise that resolves to the API response
 *                                                               with at least a success boolean property
 *
 * @example
 * // Basic request
 * const response = await databaseRequest({
 *   model: 'users',
 *   method: 'getProfile',
 *   arguments: { id: 123 }
 * });
 *
 * @example
 * // Request with automatic user ID injection
 * const response = await databaseRequest({
 *   model: 'posts',
 *   method: 'create',
 *   arguments: { title: 'New Post' }
 * }, ['author_id']);
 *
 * @throws {CustomEvent} Dispatches an AppErrorDialog event when:
 *   - API URL or JWT token is missing/invalid
 *   - The API request fails
 *   - The response indicates failure (success: false)
 */

export const baseRequest = async <T = unknown>(
  path: string,
  data: ObjectPropByName,
  isJson: boolean = true,
  tmpJwtToken?: string,
  isRetry = false
): Promise<GenericResponse<T>> => {
  const instanceApiUrl = localStorageGet('api_url');
  const instanceCode = localStorageGet('code');
  // A refresh that fails on the network falls back to the stored token; the
  // request below then reports the failure the way it always has.
  const jwtToken = tmpJwtToken || (await getFreshAccessToken().catch(() => getAccessToken()));
  const headers = {} as {
    'Content-Type': string;
    Authorization?: string;
    'aula-instance-code': string;
    'aula-frontend-version': string;
  };

  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }

  headers['aula-instance-code'] = instanceCode;
  headers['aula-frontend-version'] = process.env.VITE_APP_VERSION || 'unknown';

  if (!instanceApiUrl || !jwtToken) {
    return {
      data: null,
      count: null,
      error: t('errors.invalidToken'),
    };
  }

  if (data.method !== 'checkLogin') {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  try {
    const requestBody = isJson ? JSON.stringify(data) : data;
    const requestData = {
      method: 'POST',
      headers: headers,
      body: requestBody,
    };

    const request = await fetch(`${instanceApiUrl}${path}`, requestData as RequestInit);

    const response = await request.json();

    // BE.v1 asks for a re-issued token when the user's level or roles changed.
    // Once only: the v2 refresh grant does not clear that flag yet, and a
    // second refusal must not turn into an endless refresh loop.
    if ('success' in response && response.error === 'refresh_token' && !isRetry) {
      const newToken = await refreshSession();

      if (newToken) {
        return baseRequest<T>(path, data, isJson, newToken, true);
      }
    }

    // Handle offline mode
    if ('online_mode' in response && response.online_mode === 0) {
      redirectToOfflinePage();
    }

    if (response.error) {
      return {
        data: null,
        count: null,
        error: t(`errors.noData`),
        error_code: response.error_code,
        detail: response.detail,
      };
    }

    if (response.error_code) {
      let errorKey = 'errors.default';
      if (response.error_code === 2) {
        errorKey = 'errors.existingUser';
      }

      return {
        data: null,
        count: null,
        error: t(errorKey),
        error_code: response.error_code,
        detail: response.detail,
      };
    }

    if (!response.success) {
      return {
        data: null,
        count: null,
        error: t(`errors.failed`),
        error_code: response.error_code,
        detail: response.detail,
      };
    }

    return {
      data: (response.JWT ? response.JWT : response.data) as T,
      count: response.count,
      error: null,
    };
  } catch {
    return {
      data: null,
      count: null,
      error: t('errors.databaseError'),
    };
  }
};

/**
 * Redirects to the offline page if not already there
 */
const redirectToOfflinePage = (): void => {
  if (window.location.pathname !== '/offline') {
    window.location.href = '/offline';
  }
};

export const databaseRequest = async <T = unknown>(
  data: RequestObject,
  argumentsWithUserIdValue = [] as string[]
): Promise<GenericResponse<T>> => {
  if (argumentsWithUserIdValue.length > 0) {
    const jwt_payload = parseJwt(getAccessToken() ?? '');
    argumentsWithUserIdValue.forEach((argumentName) => {
      data.arguments[argumentName] = jwt_payload?.user_id;
    });
  }

  return baseRequest<T>(`/api/controllers/model.php?${data.method}`, data);
};
