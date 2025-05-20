import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './users';
import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';

const host = shared.getHost();

test.describe('Multi-user test with separate browser contexts', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Only run in Chromium');

  //
  test.beforeAll('set up browsers', async ({ browser }) => {
    console.log('setting up browsers...');

    // Create a context for each user
    await browsers.init(browser);

    // Log in each user
    await users.login(browsers.admin, fixtures.admin);

    // Admin should create the new users of varying permission levels
    console.info('creating alice...');
    const alicesTempPass = await users.create(browsers.admin, fixtures.alice);
    console.info('creating bob...');
    const bobsTempPass = await users.create(browsers.admin, fixtures.bob);
    console.info('creating mallory...');
    const mallorysTempPass = await users.create(browsers.admin, fixtures.mallory);
    console.info('creating burt...');
    const burtsTempPass = await users.create(browsers.admin, fixtures.burt);
    console.info('creating rainer...');
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
  });

  test.afterAll(async () => {
    await users.remove(browsers.admin, fixtures.alice);
    console.info('deleted alice...');
    await users.remove(browsers.admin, fixtures.bob);
    console.info('deleted bob...');
    await users.remove(browsers.admin, fixtures.mallory);
    console.info('deleted mallory...');
    await users.remove(browsers.admin, fixtures.burt);
    console.info('deleted burt...');
    await users.remove(browsers.admin, fixtures.rainer);
    console.info('deleted rainer...');

    // await sleep(5);

    await browsers.shutdown();

    console.info('...done!');
  });

  test('has title', async ({ page }) => {
    await browsers.admin.goto(host);

    // Expect a title "to contain" a substring.
    await expect(browsers.admin).toHaveTitle(/aula/);
  });
});
