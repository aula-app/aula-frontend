// called from playwright.config

import * as browsers from '../shared/interactions/browsers';
import * as userInteractions from '../shared/interactions/users';
import { admin } from '../fixtures/users';

export default async function globalSetup() {
  console.log('Setting up!');

  await browsers.init();

  const adminPage = await browsers.getUserBrowser('admin');
  await userInteractions.login(adminPage, admin);

  await browsers.pickle();

  console.log('✅ Setup complete');
}
