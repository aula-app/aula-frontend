// called from playwright.config

import * as userData from '../fixtures/users';
import * as browsers from '../shared/interactions/browsers';

export default async function globalSetup() {
  console.log('Setting up!');

  userData.init();
  await browsers.init();
  await userData.generateBaseUsers();
  await browsers.pickle();

  console.info('Setup complete!');
}
