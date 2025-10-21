/**
 * Test API client that uses frontend services
 * Sets up localStorage to work with existing service layer
 */

import { RoleTypes } from '../../../src/types/SettingsTypes';
import * as userService from '../../../src/services/users';
import * as roomService from '../../../src/services/rooms';
import * as ideaService from '../../../src/services/ideas';
import * as boxService from '../../../src/services/boxes';
import { changePassword as changePasswordService } from '../../../src/services/auth';
import type { Page, APIRequestContext } from '@playwright/test';

interface ApiClientConfig {
  apiUrl: string;
  instanceCode: string;
  requestContext?: APIRequestContext | Page;
  jwtToken?: string;
}

export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: ApiClientConfig) {
    this.config = config;

    // Set up localStorage for services to work (mock if not available in Node.js)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('api_url', config.apiUrl);
      localStorage.setItem('code', config.instanceCode);
      localStorage.setItem('token', config.jwtToken || '');
    } else {
      // Mock localStorage for Node.js environment
      const mockStorage = {
        getItem: (key: string) => (global as any).localStorageData?.[key] || null,
        setItem: (key: string, value: string) => {
          if (!(global as any).localStorageData) (global as any).localStorageData = {};
          (global as any).localStorageData[key] = value;
        },
        removeItem: (key: string) => {
          if ((global as any).localStorageData) delete (global as any).localStorageData[key];
        },
      };
      (global as any).localStorage = mockStorage;
      mockStorage.setItem('api_url', config.apiUrl);
      mockStorage.setItem('code', config.instanceCode);
      mockStorage.setItem('token', config.jwtToken || '');
    }
  }

  // Authentication
  async login(username: string, password: string): Promise<string> {
    // Execute login in browser context if available (has localStorage and instance code)
    if (this.config.requestContext && 'evaluate' in this.config.requestContext) {
      const page = this.config.requestContext as Page;
      const result = await page.evaluate(
        async ({ user, pass, apiUrl }) => {
          const { loginUser } = await import('../../../src/services/login');
          const response = await loginUser(
            apiUrl,
            { username: user, password: pass },
            null,
            new AbortController().signal
          );
          return response;
        },
        { user: username, pass: password, apiUrl: this.config.apiUrl }
      );

      if (!result.success) {
        console.error('❌ Login failed:', result);
        throw new Error(`Login failed: ${result.error || 'Unknown error'}`);
      }

      // Login response returns JWT directly, not in a data field
      const token = result.JWT || result.data;

      // Store token in browser's localStorage
      await page.evaluate((tok) => {
        localStorage.setItem('token', tok);
      }, token);

      return token;
    }

    // Fallback to direct API call (won't work properly without backend configured)
    const url = `${this.config.apiUrl}/api/controllers/login.php`;
    const headers = {
      'aula-instance-code': this.config.instanceCode,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({ username, password });

    console.log('📤 Request details:', { url, headers, body });

    const fetchResponse = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!fetchResponse.ok) {
      const errorBody = await fetchResponse.text();
      console.error(`❌ Login failed: ${fetchResponse.status} ${fetchResponse.statusText}`);
      console.error(`Response body: ${errorBody}`);
      throw new Error(
        `Login failed: ${fetchResponse.status} ${fetchResponse.statusText} - ${errorBody.substring(0, 200)}`
      );
    }

    const response = await fetchResponse.json();

    if (!response.success || !response.JWT) {
      console.error('❌ Login failed:', response);
      throw new Error(`Login failed: ${response.error || 'Unknown error'}`);
    }

    this.config.jwtToken = response.JWT;

    return response.JWT;
  }

  async changePassword(oldPassword: string, newPassword: string, tmpToken?: string): Promise<void> {
    if (this.config.requestContext && 'evaluate' in this.config.requestContext) {
      const page = this.config.requestContext as Page;
      const result = await page.evaluate(
        async ({ oldPw, newPw, token }) => {
          const { changePassword } = await import('../../../src/services/auth');
          const response = await changePassword(oldPw, newPw, token);
          return response;
        },
        { oldPw: oldPassword, newPw: newPassword, token: tmpToken }
      );

      if (result.error) {
        throw new Error(`Password change failed: ${result.error}`);
      }
      return;
    }

    const response = await changePasswordService(oldPassword, newPassword, tmpToken);

    if (response.error) {
      throw new Error(`Password change failed: ${response.error}`);
    }
  }

  // Users
  async addUser(args: {
    username: string;
    realname: string;
    displayname: string;
    userlevel: RoleTypes;
    email?: string;
    about_me?: string;
  }): Promise<{ insert_id: string; hash_id: string; temp_pw: string }> {
    // Execute in browser context if available (has localStorage and authenticated session)
    if (this.config.requestContext && 'evaluate' in this.config.requestContext) {
      const page = this.config.requestContext as Page;
      const result = await page.evaluate(async (userArgs) => {
        // @ts-ignore - accessing window services in browser context
        const { addUser } = await import('../../../src/services/users');
        const response = await addUser(userArgs);
        return response;
      }, args);

      if (!result.data) {
        throw new Error(`Failed to add user: ${(result as any).error || 'No data returned'}`);
      }

      return result.data;
    }

    // Fallback to direct service call (won't work in Node.js but kept for compatibility)
    const response = await userService.addUser(args);

    if (!response.data) {
      throw new Error('Failed to add user: No data returned');
    }

    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    if (this.config.requestContext && 'evaluate' in this.config.requestContext) {
      const page = this.config.requestContext as Page;
      await page.evaluate(async (id) => {
        const { deleteUser } = await import('../../../src/services/users');
        await deleteUser(id);
      }, userId);
      return;
    }
    await userService.deleteUser(userId);
  }

  async setUserPassword(userId: string, _password: string): Promise<void> {
    if (this.config.requestContext && 'evaluate' in this.config.requestContext) {
      const page = this.config.requestContext as Page;
      await page.evaluate(async (id) => {
        const { resetUserPassword } = await import('../../../src/services/users');
        await resetUserPassword(id);
      }, userId);
      return;
    }
    // Note: resetUserPassword generates a new temp password, doesn't set a specific one
    await userService.resetUserPassword(userId);
  }

  async getUsers(args?: { offset?: number; limit?: number; room_id?: string }): Promise<unknown[]> {
    if (this.config.requestContext && 'evaluate' in this.config.requestContext) {
      const page = this.config.requestContext as Page;
      const result = await page.evaluate(async (userArgs) => {
        const { getUsers } = await import('../../../src/services/users');
        const response = await getUsers(userArgs);
        return response;
      }, args);

      if (!result.data) {
        throw new Error('Failed to get users: No data returned');
      }

      return result.data;
    }

    const response = await userService.getUsers(args);

    if (!response.data) {
      throw new Error('Failed to get users: No data returned');
    }

    return response.data;
  }

  // Rooms
  async addRoom(args: {
    room_name: string;
    description_internal?: string;
    description_public?: string;
    internal_info?: string;
    phase_duration_1?: number;
    phase_duration_2?: number;
    phase_duration_3?: number;
    phase_duration_4?: number;
    status?: number;
  }): Promise<{ insert_id: number; hash_id: string }> {
    const url = `${this.config.apiUrl}/api/controllers/model.php?addRoom`;
    const headers = {
      'aula-instance-code': this.config.instanceCode,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.jwtToken || localStorage.getItem('token') || ''}`,
      'Accept': 'application/json',
    };
    const body = JSON.stringify({ arguments: args, model: 'Room', method: 'addRoom' });

    console.log('📤 Request details:', { url, headers, body });
    const fetchResponse = await fetch(url, { method: 'POST', headers, body });

    if (!fetchResponse.ok) {
      const errorBody = await fetchResponse.text();
      console.error(`❌ Request failed: ${fetchResponse.status} ${fetchResponse.statusText}`);
      console.error(`Response body: ${errorBody}`);
      throw new Error(
        `Request failed: ${fetchResponse.status} ${fetchResponse.statusText} - ${errorBody.substring(0, 200)}`
      );
    }

    try {
      const response = await fetchResponse.json();

      if (!response.success) {
        console.error('❌ Request failed:', response);
        throw new Error(`Request failed: ${response.error || 'Unknown error'}`);
      }

      if (!response.data) {
        throw new Error('Failed to add room: No data returned');
      }

      return response.data;
    } catch (exception) {
      console.error('❌ Parsing response failed:', await fetchResponse.text());
      throw new Error(`Parsing response failed`);
    }
  }

  async deleteRoom(roomId: string): Promise<void> {
    await roomService.deleteRoom(roomId);
  }

  async addUserToRoom(userId: string, roomId: string): Promise<void> {
    await userService.addUserRoom(userId, roomId);
  }

  // Boxes
  async addBox(args: {
    name: string;
    room_id: string;
    phase_id: number;
    description_internal?: string;
    description_public?: string;
    phase_duration_1?: number;
    phase_duration_2?: number;
    phase_duration_3?: number;
    phase_duration_4?: number;
  }): Promise<{ insert_id: number; hash_id: string }> {
    const response = await boxService.addBox(args);

    if (!response.data) {
      throw new Error('Failed to add box: No data returned');
    }

    return response.data;
  }

  async deleteBox(boxId: string): Promise<void> {
    await boxService.deleteBox(boxId);
  }

  // Ideas
  async addIdea(
    args: {
      title: string;
      content: string;
      room_id: string;
      topic_id?: string;
    },
    _userId: string
  ): Promise<{ hash_id: string }> {
    // Note: user_id is automatically injected by databaseRequest from JWT token
    const response = await ideaService.addIdea(args);

    if (!response.data) {
      throw new Error('Failed to add idea: No data returned');
    }

    return response.data;
  }

  async deleteIdea(ideaId: string): Promise<void> {
    await ideaService.deleteIdea(ideaId);
  }

  async addIdeaToBox(ideaId: string, boxId: string): Promise<void> {
    await ideaService.addIdeaBox(ideaId, boxId);
  }
}

/**
 * Create an API client instance for tests
 * @param requestContext - Playwright Page or APIRequestContext to use for requests (uses Vite proxy)
 */
export function createTestApiClient(requestContext?: APIRequestContext | Page, jwtToken?: string): ApiClient {
  // As a fallback, use frontend host (localhost:3000) which goes through Vite proxy to backend
  const apiUrl = process.env.APP_BACKEND_HOST || process.env.APP_FRONTEND_HOST || 'http://localhost:3000';
  const instanceCode = process.env.INSTANCE_CODE || 'SINGLE';

  return new ApiClient({
    apiUrl,
    instanceCode,
    requestContext,
    jwtToken,
  });
}
