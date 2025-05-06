// called from playwright.config
import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './page_interactions/users';
import * as rooms from './page_interactions/rooms';
import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';

export default async function globalTeardown() {
  await browsers.recall();

  fixtures.init();

  await users.remove(browsers.admin, fixtures.alice);
  console.info('deleted alice...', fixtures.alice.username);
  await users.remove(browsers.admin, fixtures.bob);
  console.info('deleted bob...', fixtures.bob.username);
  await users.remove(browsers.admin, fixtures.mallory);
  console.info('deleted mallory...', fixtures.mallory.username);
  await users.remove(browsers.admin, fixtures.burt);
  console.info('deleted...', fixtures.burt.username);
  await users.remove(browsers.admin, fixtures.rainer);
  console.info('deleted...', fixtures.rainer.username);

  // await sleep(5);

  await browsers.shutdown();
  // Do any cleanup here
  console.log('Cleaning up after all tests...');

  // Example: delete saved auth files
  const fs = await import('fs/promises');
  await fs.rm('admin-context.json', { force: true });
  await fs.rm('alice-context.json', { force: true });
  await fs.rm('bob-context.json', { force: true });
  await fs.rm('mallory-context.json', { force: true });
  await fs.rm('burt-context.json', { force: true });
  await fs.rm('rainer-context.json', { force: true });
}
