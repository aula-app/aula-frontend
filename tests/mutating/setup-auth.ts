// called from playwright.config

import * as userData from '../fixtures/users';
import * as browsers from '../shared/interactions/browsers';
import { createTestApiClient } from '../shared/helpers/api-calls';

export default async function globalSetup() {
  console.log('Setting up!');

  await browsers.init();
  await browsers.pickle();
}

// export const generateBaseUsers = async () => {
//   console.log('🔧 Generating base users via API...');
//   try {
//     // Get admin browser
//     const adminPage = await browsers.getUserBrowser('admin');
//     if (!adminPage) {
//       throw new Error('Admin browser not available.');
//     }

//     // Login admin via browser (this works and sets up the session properly)
//     await adminPage.goto(process.env.APP_FRONTEND_HOST || 'http://localhost:3000');
//     await adminPage.fill('input[name="username"]', userData.admin.username);
//     await adminPage.fill('input[name="password"]', userData.admin.password);
//     await adminPage.locator('button[type="submit"]').click();
//     await adminPage.waitForLoadState('networkidle');
//     await browsers.saveState('admin');
//     console.log('✅ Admin logged in successfully');

//     // Create API client with admin page context (now has authenticated session)
//     const apiClient = createTestApiClient(adminPage);

//     // Create users via API
//     for (const [userKey, user] of Object.entries(userData.all())) {
//       console.log(`🔧 Creating user via API: ${user.username}`);

//       // Create user via API
//       const result = await apiClient.addUser({
//         username: user.username,
//         realname: user.realName,
//         displayname: user.displayName,
//         userlevel: user.role,
//         email: '',
//         about_me: user.about,
//       });

//       if (!result.insert_id || !result.temp_pw) {
//         console.error('❌ Failed to create user:', user.username);
//         return false;
//       }

//       console.log(`✅ User created via API: ${user.username}`);

//       // Get user's own browser for their operations
//       const userBrowser = await browsers.getUserBrowser(user.username);
//       if (!userBrowser) {
//         console.error('❌ No browser found for user:', userKey);
//         return false;
//       }

//       // Navigate to app first (needed for API calls via page.evaluate)
//       await userBrowser.goto(process.env.APP_FRONTEND_HOST || 'http://localhost:3000');

//       // Create API client for this user using their own browser context (now loaded)
//       const userApiClient = createTestApiClient(userBrowser);

//       // Change password from temp to actual password via API (using user's browser)
//       const tempToken = await userApiClient.login(user.username, result.temp_pw);
//       await userApiClient.changePassword(result.temp_pw, user.password, tempToken);
//       // Login with actual password (this also stores token in localStorage)
//       await userApiClient.login(user.username, user.password);
//       console.log(`✅ Password changed and logged in for user: ${user.username}`);

//       // User is now logged in with token in localStorage, just save the browser state
//       await browsers.saveState(user.username);
//       console.log('✅ User browser state saved:', userKey);
//     }

//     console.log('✅ All users created successfully via API');
//   } catch (error) {
//     console.error('❌ Error generating base users:', error);
//     throw error;
//   }
// };
