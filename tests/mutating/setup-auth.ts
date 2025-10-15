// called from playwright.config

import * as userData from '../fixtures/users';
import * as browsers from '../shared/interactions/browsers';
import * as userInteractions from '../shared/interactions/users';

export default async function globalSetup() {
  console.log('Setting up!');

  userData.init();
  await browsers.init();
  await generateBaseUsers();
  await browsers.pickle();

  console.info('Setup complete!');
}

export const generateBaseUsers = async () => {
  console.log('🔧 Generating base users...');
  try {
    const adminPage = await browsers.getUserBrowser('admin');
    if (!adminPage) {
      throw new Error('Admin browser not available. Make sure browsers are initialized.');
    }

    await userInteractions.login(adminPage, userData.admin);
    await browsers.saveState('admin');

    for (const [userKey, user] of Object.entries(userData.all())) {
      // Create user on the platform
      const tempPassword = await userInteractions.create(adminPage, user);

      if (!tempPassword) {
        console.error('❌ Failed to create user:', user.username);
        return false;
      }

      // Get the existing browser for this user
      const userBrowser = await browsers.getUserBrowser(user.username);
      if (userBrowser) {
        await userInteractions.register(userBrowser, user, tempPassword);
        await browsers.saveState(user.username);
        console.log('✅ User created and registered:', userKey);
      } else {
        console.error('❌ No browser found for user:', userKey);
        return false;
      }
    }

    console.log('✅ All users created successfully');
  } catch (error) {
    console.error('❌ Error generating base users:', error);
    throw error;
  }
};
