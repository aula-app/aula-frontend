import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './page_interactions/users';
import * as rooms from './page_interactions/rooms';
import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';

const host = shared.getHost();

test('create room', async ({ page }) => {
  fixtures.init();

  console.log('test creating room!');
  // Expect a title "to contain" a substring.
  await browsers.recall();

  console.log('hellooo');

  await rooms.create(browsers.admin, 'tesssttt', [
    //
    fixtures.rainer, //
    fixtures.alice,
    fixtures.bob,
    fixtures.mallory, //
  ]);
});
