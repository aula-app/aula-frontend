import { Page } from '@playwright/test';
import { UserData } from '../support/types';

export async function createUserViaAPI(adminPage: Page, userData: UserData): Promise<string> {
  await adminPage.waitForFunction(() => localStorage.getItem('code'));
  const { apiUrl, code, token } = await adminPage.evaluate(() => ({
    apiUrl: localStorage.getItem('api_url'),
    code: localStorage.getItem('code'),
    token: localStorage.getItem('token'),
  }));

  if (!apiUrl || !code) {
    throw new Error('API URL or instance code not found in admin page');
  }

  if (!token) {
    throw new Error('Admin token not found');
  }

  return await postUserAddUser(apiUrl, code, token, userData);
}

export async function registerUserViaAPI(page: Page, userData: UserData): Promise<string> {
  await page.waitForFunction(() => localStorage.getItem('code'));
  const { code, apiUrl } = await page.evaluate(() => ({
    code: localStorage.getItem('code'),
    apiUrl: localStorage.getItem('api_url'),
  }));

  if (!code || !apiUrl) {
    throw new Error('Instance code or API URL not found in page context');
  }

  const loginToken = await postLogin(apiUrl, code, userData);
  await postChangePassword(apiUrl, code, loginToken, userData);

  // Login again with new password to get final token
  return await postLogin(apiUrl, code, userData);
}

export async function saveAuthenticationState(page: Page, token: string, storageStatePath: string): Promise<void> {
  await page.evaluate((token) => {
    localStorage.setItem('token', token);
    if (!localStorage.getItem('code')) throw new Error('code not found in localStorage');
    if (!localStorage.getItem('api_url')) throw new Error('api_url not found in localStorage');
    if (!localStorage.getItem('config')) throw new Error('config not found in localStorage');
  }, token);

  await page.context().storageState({ path: storageStatePath });
}

async function postUserAddUser(apiUrl: string, code: string, token: string, userData: UserData) {
  const response = await fetch(`${apiUrl}/api/controllers/model.php?addUser`, {
    method: 'POST',
    headers: {
      'aula-instance-code': code,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: 'User',
      method: 'addUser',
      arguments: {
        username: userData.username,
        displayname: userData.displayName,
        realname: userData.realName,
        about_me: userData.about,
        userlevel: userData.role,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create user: HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data.error || !data.data?.temp_pw) {
    throw new Error(`Failed to create user: ${data.error || 'No temp password returned'}`);
  }

  return data.data.temp_pw;
}

async function postLogin(apiUrl: string, code: string, userData: UserData) {
  const response = await fetch(`${apiUrl}/api/controllers/login.php`, {
    method: 'POST',
    headers: {
      'aula-instance-code': code,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: userData.username,
      password: userData.tempPass || userData.password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed with status: ${response.status}`);
  }

  const data = await response.json();
  const loginToken = data.JWT || data.token || data.data;
  if (!loginToken) {
    throw new Error(`No token received from login. Response: ${JSON.stringify(data)}`);
  }

  return loginToken;
}

async function postChangePassword(apiUrl: string, code: string, loginToken: any, userData: UserData) {
  const response = await fetch(`${apiUrl}/api/controllers/change_password.php`, {
    method: 'POST',
    headers: {
      'aula-instance-code': code,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginToken}`,
    },
    body: JSON.stringify({
      password: userData.tempPass,
      new_password: userData.password,
    }),
  });

  if (!response.ok) {
    throw new Error('Password change failed');
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(`Password change error: ${data.error}`);
  }

  delete userData.tempPass;
}
