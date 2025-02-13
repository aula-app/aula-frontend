import { useEventLogout } from '@/hooks';
import { ObjectPropByName, StatusTypes } from '../types/Generics';
import { parseJwt } from '../utils/jwt';
import { localStorageGet } from '../utils/localStorage';
import { t } from 'i18next';
import { useAppStore } from '@/store';

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

export interface GenericResponse {
  data: any;
  count: number | null;
  error: string | null;
}

export interface GenericListRequest {
  offset: number;
  limit: number;
  orderby?: number;
  asc?: 0 | 1;
  search_field?: string;
  search_text?: string;
  both_names?: string;
  status?: StatusTypes;
}

/**
 * Custom error event used for displaying error messages in the application.
 */
const addError = (error: string) => new CustomEvent('AppErrorDialog', { detail: error });

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

export const baseRequest = async (
  url: string,
  data: ObjectPropByName,
  isJson: boolean = true,
  tmp_token?: string
): Promise<GenericResponse> => {
  const api_url = localStorageGet('api_url');
  const jwt_token = tmp_token || localStorageGet('token');
  const [, dispatch] = useAppStore();
  const headers = {} as { 'Content-Type': string; Authorization?: string };

  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (!api_url || !jwt_token) {
    return {
      data: null,
      count: null,
      error: t('errors.invalidToken'),
    };
  }

  if (data.method !== 'checkLogin') {
    headers['Authorization'] = `Bearer ${jwt_token}`;
  }

  try {
    const requestBody = isJson ? JSON.stringify(data) : data;
    const requestData = {
      method: 'POST',
      headers: headers,
      body: requestBody,
    };

    /* @ts-ignore */
    const request = await fetch(`${api_url}${url}`, requestData);

    const response = await request.json();

    if (response.error) {
      if ('online_mode' in response && response.online_mode === 0) {
        dispatch({ type: 'ADD_POPUP', message: { message: t('errors.offline'), type: 'error' } });
        useEventLogout();
      } else {
        return {
          data: null,
          count: null,
          error: t(`errors.noData`),
        };
      }
    }

    if (!response.success) {
      return {
        data: null,
        count: null,
        error: t(`errors.failed`),
      };
    }

    return {
      data: response.data || response.JWT,
      count: response.count,
      error: null,
    };
  } catch (e) {
    return {
      data: null,
      count: null,
      error: t('errors.databaseError'),
    };
  }
};

export const databaseRequest = async (data: RequestObject, userId = [] as string[]) => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);

  if (userId.length > 0) {
    userId.forEach((field) => {
      data.arguments[field] = jwt_payload?.user_id;
    });
  }

  return baseRequest(`/api/controllers/model.php?${data.method}`, data);
};
