import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './users';

const host = shared.getHost();

const aliceData: shared.UserData = {
  username: 'alice-' + shared.timestamp,
  password: 'aula',
  displayName: 'alice-' + shared.timestamp,
  realName: 'Alice Testing',
  role: 'user',
  about: 'generated on ' + shared.timestring + 'in automated testing framework. should be deleted.',
};
const bobData: shared.UserData = {
  username: 'bob-' + shared.timestamp,
  password: 'aula',
  displayName: 'bob-' + shared.timestamp,
  realName: 'Bob Testing',
  role: 'user',
  about: 'generated on ' + shared.timestring + 'in automated testing framework. should be deleted.',
};

const adminData: shared.UserData = {
  username: 'admin',
  password: 'aula',
  displayName: 'Admin',
  realName: 'Admin User',
  role: 'admin',
  about: '',
};

let admins_browser: BrowserContext;
let alices_browser: BrowserContext;
let bobs_browser: BrowserContext;

let adminPage: Page;
let alicePage: Page;
let bobPage: Page;

test.describe('Multi-user test with separate browser contexts', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Only run in Chromium');

  //
  test.beforeAll('set up browsers', async ({ browser }) => {
    console.log('setting up browsers...');
    // Create a context for each user

    await Promise.all([
      browser.newContext().then(async (b) => {
        admins_browser = b;
        adminPage = await admins_browser.newPage();
      }),
      browser.newContext().then(async (b) => {
        alices_browser = b;
        alicePage = await alices_browser.newPage();
      }),
      browser.newContext().then(async (b) => {
        bobs_browser = b;
        bobPage = await bobs_browser.newPage();
      }),
    ]);

    // Log in each user
    await users.login(adminPage, adminData);

    // Admin should create the new users
    const alicesTempPass = await users.create(adminPage, aliceData);
    console.info('created alice...');
    const bobsTempPass = await users.create(adminPage, bobData);
    console.info('created bob...');

    await Promise.all([
      users.firstLogin(alicePage, aliceData, alicesTempPass),
      users.firstLogin(bobPage, bobData, bobsTempPass),
    ]);

    await sleep(5);
  });

  test.afterAll(async () => {
    await users.remove(adminPage, aliceData);
    console.info('deleted alice...');

    await users.remove(adminPage, bobData);
    console.info('deleted bob...');

    //await sleep(5);

    await admins_browser.close();

    await alices_browser.close();
    await bobs_browser.close();
    console.info('...done!');
  });

  test('has title', async ({ page }) => {
    await adminPage.goto(host);

    // Expect a title "to contain" a substring.
    await expect(adminPage).toHaveTitle(/aula/);
  });
});
