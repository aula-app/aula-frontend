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

export const newPage = (browser: BrowserContext): Promise<Page> => browser.newPage();

export const init = async () => {
  const browser = await chromium.launch();

  try {
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
    console.info('✅ Browsers initialized');
  } catch (error) {
    console.error('❌ Error during browsers initialization:', error);
    await shutdown();
    throw error;
  }
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
  await admin.context().storageState({ path: 'tests/temp/admin-context.json' });
  await alice.context().storageState({ path: 'tests/temp/alice-context.json' });
  await bob.context().storageState({ path: 'tests/temp/bob-context.json' });
  await mallory.context().storageState({ path: 'tests/temp/mallory-context.json' });
  await burt.context().storageState({ path: 'tests/temp/burt-context.json' });
  await rainer.context().storageState({ path: 'tests/temp/rainer-context.json' });

  // Also save to auth-states for other tests to use
  await admin.context().storageState({ path: 'tests/auth-states/admin.json' });
  await alice.context().storageState({ path: 'tests/auth-states/alice.json' });
  await bob.context().storageState({ path: 'tests/auth-states/bob.json' });
  await mallory.context().storageState({ path: 'tests/auth-states/mallory.json' });
  await burt.context().storageState({ path: 'tests/auth-states/burt.json' });
  await rainer.context().storageState({ path: 'tests/auth-states/rainer.json' });
};

// This function exists to recall the logged in browser states
//  which were initialized in setup-auth.ts
// tests should call it to initialize the singleton browsers in
// this namespace
export const recall = async () => {
  const browser = await chromium.launch();

  await Promise.all([
    browser.newContext({ storageState: 'tests/temp/admin-context.json' }).then(async (b) => {
      admins_browser = b;
      admin = await admins_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/temp/alice-context.json' }).then(async (b) => {
      alices_browser = b;
      alice = await alices_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/temp/bob-context.json' }).then(async (b) => {
      bobs_browser = b;
      bob = await bobs_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/temp/mallory-context.json' }).then(async (b) => {
      mallorys_browser = b;
      mallory = await mallorys_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/temp/burt-context.json' }).then(async (b) => {
      burt_browser = b;
      burt = await burt_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/temp/rainer-context.json' }).then(async (b) => {
      rainer_browser = b;
      rainer = await rainer_browser.newPage();
    }),
  ]);
};

// Recall from auth-states directory (for tests that depend on user creation)
export const recallFromAuthStates = async () => {
  const browser = await chromium.launch();

  await Promise.all([
    browser.newContext({ storageState: 'tests/auth-states/admin.json' }).then(async (b) => {
      admins_browser = b;
      admin = await admins_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/auth-states/alice.json' }).then(async (b) => {
      alices_browser = b;
      alice = await alices_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/auth-states/bob.json' }).then(async (b) => {
      bobs_browser = b;
      bob = await bobs_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/auth-states/mallory.json' }).then(async (b) => {
      mallorys_browser = b;
      mallory = await mallorys_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/auth-states/burt.json' }).then(async (b) => {
      burt_browser = b;
      burt = await burt_browser.newPage();
    }),
    browser.newContext({ storageState: 'tests/auth-states/rainer.json' }).then(async (b) => {
      rainer_browser = b;
      rainer = await rainer_browser.newPage();
    }),
  ]);
};
