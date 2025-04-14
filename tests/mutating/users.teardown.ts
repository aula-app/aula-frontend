import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './page_interactions/users';
import * as rooms from './page_interactions/rooms';
import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';

const host = shared.getHost();

test('tear down and delete', async () => {
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

test('ooooo teardown', async ({ page }) => {
  expect(1).toBe(1);
});
