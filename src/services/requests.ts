import { ScopeType } from '@/types/Scopes';
import { ObjectPropByName } from '../types/Generics';
import { parseJwt } from '../utils/jwt';
import { localStorageGet } from '../utils/localStorage';

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

interface GetResponse extends GenericResponse {
  data: Array<ScopeType> | null;
}

/**
 * Custom error event used for displaying error messages in the application.
 */
const error = new CustomEvent('AppErrorDialog', { detail: 'texts.error' });

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

export const databaseRequest = async (requestData: RequestObject, userId = [] as string[]): Promise<GetResponse> => {
  const api_url = localStorageGet('api_url');
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const headers = { 'Content-Type': 'application/json' } as { 'Content-Type': string; Authorization?: string };

  if (!api_url || !jwt_payload) {
    document.dispatchEvent(error);
    return {
      data: null,
      count: null,
      error: 'Invalid API URL or JWT token',
    };
  }

  if (requestData.method !== 'checkLogin') {
    headers['Authorization'] = `Bearer ${jwt_token}`;
  }

  if (userId.length > 0) {
    userId.forEach((field) => {
      requestData.arguments[field] = jwt_payload?.user_id;
    });
  }

  try {
    const data = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    };

    const request = await fetch(`${api_url}/api/controllers/model.php?${requestData.method}`, data);

    const response = await request.json();

    if (!response.success) {
      if ('online_mode' in response && response.online_mode === 0) {
        if (window.location.pathname !== '/offline') window.location.href = '/offline';
      } else {
        document.dispatchEvent(error);
        return {
          data: null,
          count: null,
          error: 'Failed to fetch data',
        };
      }
    }

    return {
      data: response.data,
      count: response.count,
      error: null,
    };
  } catch (e) {
    document.dispatchEvent(error);
    return {
      data: null,
      count: null,
      error: 'Something went wrong',
    };
  }
};
