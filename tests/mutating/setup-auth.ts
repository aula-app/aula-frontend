// called from playwright.config
import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';

import * as shared from '../shared/shared';

import * as users from '../shared/page_interactions/users';
import * as fixtures from '../fixtures/users';
import * as browsers from '../shared/page_interactions/browsers';

export default async function globalSetup() {
  // first we make a run id, this will be helpful in the mutating tests

  console.log('Setting up!');

  shared.setRunId();

  fixtures.init();

  //
  await browsers.init();
  // Log in each user
  await users.login(browsers.admin, fixtures.admin);

  // Admin should create the new users of varying permission levels
  console.log('creating...', fixtures.alice.username);
  const alicesTempPass = await users.create(browsers.admin, fixtures.alice);
  console.log('creating...', fixtures.bob.username);
  const bobsTempPass = await users.create(browsers.admin, fixtures.bob);
  console.log('creating...', fixtures.mallory.username);
  const mallorysTempPass = await users.create(browsers.admin, fixtures.mallory);
  console.log('creating...', fixtures.burt.username);
  const burtsTempPass = await users.create(browsers.admin, fixtures.burt);
  console.log('creating...', fixtures.rainer.username);
  const rainersTempPass = await users.create(browsers.admin, fixtures.rainer);

  // mallory should _not_ be able to log in with bob's temporary password.
  await expect(async () => {
    await users.firstLoginFlow(browsers.mallory, fixtures.mallory, bobsTempPass);
  }).rejects.toThrow();

  // now we should correctly log in all of the users into their browsers.
  // first login flow should work nicely!
  await Promise.all([
    users.firstLoginFlow(browsers.alice, fixtures.alice, alicesTempPass),
    users.firstLoginFlow(browsers.bob, fixtures.bob, bobsTempPass),
    users.firstLoginFlow(browsers.mallory, fixtures.mallory, mallorysTempPass),
    users.firstLoginFlow(browsers.burt, fixtures.burt, burtsTempPass),
    users.firstLoginFlow(browsers.rainer, fixtures.rainer, rainersTempPass),
  ]);

  await browsers.pickle();

  await browsers.shutdown();
}
