// called from playwright.config

import * as userData from '../fixtures/users';
import * as browsers from '../shared/interactions/browsers';

export default async function globalSetup() {
  // first we make a run id, this will be helpful in the mutating tests

  console.log('Setting up!');

  userData.init();
  await browsers.init();
}
