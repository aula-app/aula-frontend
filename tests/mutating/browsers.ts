import { BrowserContext, Page, chromium } from '@playwright/test';

// this namespace stores the playwright browsers and pages in
// a singleton state.  Must be init()ed or recall()ed before use.

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

export const init = async () => {
  const browser = await chromium.launch();

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

export const pickle = async () => {
  await admin.context().storageState({ path: 'admin-context.json' });
  await alice.context().storageState({ path: 'alice-context.json' });
  await bob.context().storageState({ path: 'bob-context.json' });
  await mallory.context().storageState({ path: 'mallory-context.json' });
  await burt.context().storageState({ path: 'burt-context.json' });
  await rainer.context().storageState({ path: 'rainer-context.json' });
};

// This function exists to recall the logged in browser states
//  which were initialized in setup-auth.ts
// tests should call it to initialize the singleton browsers in
// this namespace
export const recall = async () => {
  const browser = await chromium.launch();

  await Promise.all([
    browser.newContext({ storageState: 'admin-context.json' }).then(async (b) => {
      admins_browser = b;
      admin = await admins_browser.newPage();
    }),
    browser.newContext({ storageState: 'alice-context.json' }).then(async (b) => {
      alices_browser = b;
      alice = await alices_browser.newPage();
    }),
    browser.newContext({ storageState: 'bob-context.json' }).then(async (b) => {
      bobs_browser = b;
      bob = await bobs_browser.newPage();
    }),
    browser.newContext({ storageState: 'mallory-context.json' }).then(async (b) => {
      mallorys_browser = b;
      mallory = await mallorys_browser.newPage();
    }),
    browser.newContext({ storageState: 'burt-context.json' }).then(async (b) => {
      burt_browser = b;
      burt = await burt_browser.newPage();
    }),
    browser.newContext({ storageState: 'rainer-context.json' }).then(async (b) => {
      rainer_browser = b;
      rainer = await rainer_browser.newPage();
    }),
  ]);
};
