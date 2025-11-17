import { Page } from '@playwright/test';
import { UserData } from '../support/types';

export async function createUserViaAPI(adminPage: Page, userData: UserData): Promise<string> {
  const { apiUrl, code } = await adminPage.evaluate(() => ({
    apiUrl: localStorage.getItem('api_url'),
    code: localStorage.getItem('code'),
  }));

  if (!apiUrl || !code) {
    throw new Error('API URL or instance code not found in admin page');
  }

  const token = await adminPage.evaluate(() => localStorage.getItem('token'));
  if (!token) {
    throw new Error('Admin token not found');
  }
  const result = await adminPage.evaluate(
    async ({ username, displayName, realName, about, role, apiUrl, code, token }) => {
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
            username,
            displayname: displayName,
            realname: realName,
            about_me: about,
            userlevel: role,
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
    },
    {
      username: userData.username,
      displayName: userData.displayName,
      realName: userData.realName,
      about: userData.about,
      role: userData.role,
      apiUrl,
      code,
      token,
    }
  );

  return result;
}

export async function registerUserViaAPI(
  page: Page,
  userData: UserData,
  tempPassword: string
): Promise<string> {
  const { code, apiUrl } = await page.evaluate(() => ({
    code: localStorage.getItem('code'),
    apiUrl: localStorage.getItem('api_url'),
  }));

  if (!code || !apiUrl) {
    throw new Error('Instance code or API URL not found in page context');
  }
  const loginToken = await page.evaluate(
    async ({ username, tempPassword, apiUrl, code }) => {
      const response = await fetch(`${apiUrl}/api/controllers/login.php`, {
        method: 'POST',
        headers: {
          'aula-instance-code': code,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password: tempPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const data = await response.json();
      const token = data.JWT || data.token || data.data;
      if (!token) {
        throw new Error(`No token received from login. Response: ${JSON.stringify(data)}`);
      }
      return token;
    },
    { username: userData.username, tempPassword, apiUrl, code }
  );
  await page.evaluate(
    async ({ tempPassword, newPassword, apiUrl, code, token }) => {
      const response = await fetch(`${apiUrl}/api/controllers/change_password.php`, {
        method: 'POST',
        headers: {
          'aula-instance-code': code,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: tempPassword,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Password change failed');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(`Password change error: ${data.error}`);
      }
    },
    { tempPassword, newPassword: userData.password, apiUrl, code, token: loginToken }
  );

  // Login again with new password to get final token
  const finalToken = await page.evaluate(
    async ({ username, password, apiUrl, code }) => {
      const response = await fetch(`${apiUrl}/api/controllers/login.php`, {
        method: 'POST',
        headers: {
          'aula-instance-code': code,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Final login failed with status: ${response.status}`);
      }

      const data = await response.json();
      const token = data.JWT || data.token || data.data;
      if (!token) {
        throw new Error(`No token received from final login. Response: ${JSON.stringify(data)}`);
      }
      return token;
    },
    { username: userData.username, password: userData.password, apiUrl, code }
  );

  return finalToken;
}

export async function saveAuthenticationState(
  page: Page,
  token: string,
  storageStatePath: string
): Promise<void> {
  await page.evaluate((token) => {
    localStorage.setItem('token', token);
    if (!localStorage.getItem('code')) throw new Error('code not found in localStorage');
    if (!localStorage.getItem('api_url')) throw new Error('api_url not found in localStorage');
    if (!localStorage.getItem('config')) throw new Error('config not found in localStorage');
  }, token);

  // Verify token was set
  const savedToken = await page.evaluate(() => localStorage.getItem('token'));
  console.log(`   Token set in localStorage: ${savedToken ? 'YES' : 'NO'}`);

  await page.waitForTimeout(100);
  await page.context().storageState({ path: storageStatePath });
  console.log(`💾 Saved authentication state to ${storageStatePath}`);

  // Verify file was created
  const fs = await import('fs');
  const exists = fs.existsSync(storageStatePath);
  console.log(`   Storage state file exists: ${exists ? 'YES' : 'NO'}`);
}
