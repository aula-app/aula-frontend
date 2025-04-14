import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './page_interactions/users';
import * as rooms from './page_interactions/rooms';
import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';

export let admins_browser: BrowserContext;
export let alices_browser: BrowserContext;
export let bobs_browser: BrowserContext;
export let mallorys_browser: BrowserContext;
export let burt_browser: BrowserContext;
export let rainer_browser: BrowserContext;

export let admin: Page;
export let alice: Page;
export let bob: Page;
export let mallory: Page;
export let burt: Page;
export let rainer: Page;

export let b = 0;

export const init = async () => {
  const browser = await chromium.launch();

  b = 45;

  await Promise.all([
    browser.newContext().then(async (b) => {
      admins_browser = b;
      admin = await admins_browser.newPage();
    }),
    browser.newContext().then(async (b) => {
      alices_browser = b;
      alice = await alices_browser.newPage();
    }),
    browser.newContext().then(async (b) => {
      bobs_browser = b;
      bob = await bobs_browser.newPage();
    }),
    browser.newContext().then(async (b) => {
      mallorys_browser = b;
      mallory = await mallorys_browser.newPage();
    }),
    browser.newContext().then(async (b) => {
      burt_browser = b;
      burt = await burt_browser.newPage();
    }),
    browser.newContext().then(async (b) => {
      rainer_browser = b;
      rainer = await rainer_browser.newPage();
    }),
  ]);
};

export const shutdown = async () => {
  await admins_browser.close();
  await alices_browser.close();
  await bobs_browser.close();
  await mallorys_browser.close();
  await burt_browser.close();
  await rainer_browser.close();
};
