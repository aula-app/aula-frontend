import { BrowserContext, Page, chromium, Browser } from '@playwright/test';

// Dynamic browser and page management
export const contexts = {} as Record<string, BrowserContext>;
export const pages = {} as Record<string, Page>;

// Shared browser instance for efficiency
let sharedBrowser: Browser | null = null;

// Get or create shared browser instance
const getSharedBrowser = async (): Promise<Browser> => {
  if (!sharedBrowser) {
    sharedBrowser = await chromium.launch();
  }
  return sharedBrowser;
};

export const getUserBrowserContext = async (userKey: string): Promise<BrowserContext> => {
  if (!pages[userKey]) {
    create(userKey);
  }
  return contexts[userKey];
};

export const getUserBrowser = async (userKey: string): Promise<Page> => {
  if (!pages[userKey]) {
    await create(userKey);
  }
  return pages[userKey];
};

export const create = async (userKey: string, storageState?: string): Promise<Page> => {
  if (contexts[userKey]) {
    console.warn(`⚠️ Browser already exists for user: ${userKey}`);
    return pages[userKey];
  }

  const browser = await getSharedBrowser();
  const userBrowser = await browser.newContext(storageState ? { storageState } : {});
  const page = await userBrowser.newPage();

  contexts[userKey] = userBrowser;
  pages[userKey] = page;

  console.info(`✅ Browser created for user: ${userKey}`);
  return page;
};

export const remove = async (userKey: string): Promise<void> => {
  if (contexts[userKey]) {
    await contexts[userKey].close();
    delete contexts[userKey];
  }
  if (pages[userKey]) {
    delete pages[userKey];
  }
  console.info(`✅ Browser removed for user: ${userKey}`);
};

export const saveState = async (userKey: string, path?: string): Promise<void> => {
  if (pages[userKey]) {
    const statePath = path || `tests/auth-states/${userKey}-context.json`;
    await pages[userKey].context().storageState({ path: statePath });

    console.info(`✅ State saved for user: ${userKey} at ${statePath} `);
  }
};

/**
 * Get the JWT token from a user's browser storageState
 * @param userKey - The user identifier
 * @returns The JWT token or null if not found
 */
export const getJWT = async (userKey: string): Promise<string | null> => {
  if (!pages[userKey]) {
    console.warn(`⚠️ No browser found for user: ${userKey}`);
    return null;
  }

  try {
    // Get storageState from the browser context (doesn't require page navigation)
    const state = await pages[userKey].context().storageState();

    // Find token in localStorage
    for (const origin of state.origins || []) {
      const tokenItem = origin.localStorage?.find((item) => item.name === 'token');
      if (tokenItem) {
        return tokenItem.value;
      }
    }

    return null;
  } catch (error) {
    console.error(`❌ Error getting JWT for ${userKey}:`, error);
    return null;
  }
};

export const newPage = (browser: BrowserContext): Promise<Page> => browser.newPage();

export const init = async () => {
  try {
    await create('admin');
    console.info('✅ Admin Browser initialized');
  } catch (error) {
    console.error('❌ Error during contexts initialization:', error);
    await shutdown();
    throw error;
  }
};

export const shutdown = async () => {
  for (const [userKey, browser] of Object.entries(contexts)) {
    console.info(`Shutting down browser for user: ${userKey}`);
    if (browser) {
      await browser.close();
    }
  }
  // Clear all references
  Object.keys(contexts).forEach((key) => delete contexts[key]);
  Object.keys(pages).forEach((key) => delete pages[key]);

  // Close shared browser
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
};

export const pickle = async () => {
  for (const [userKey, page] of Object.entries(pages)) {
    if (page) {
      await saveState(userKey);
    }
  }
};

// This function exists to recall the logged in browser states
//  which were initialized in setup-auth.ts
// tests should call it to initialize the singleton contexts in
// this namespace
export const recall = async (userKeys: string[] = ['admin']) => {
  try {
    await Promise.all(userKeys.map((userKey) => create(userKey, `tests/auth-states/${userKey}-context.json`)));
    console.info('✅ Successfully recalled browser states from temp');
  } catch (error) {
    console.error('❌ Error recalling browser states:', error);
    throw error;
  }
};

// Recall from auth-states directory (for tests that depend on user creation)
export const recallFromAuthStates = async (userKeys: string[] = ['admin']) => {
  try {
    await Promise.all(userKeys.map((userKey) => create(userKey, `tests/auth-states/${userKey}-context.json`)));
    console.info('✅ Successfully recalled browser states from auth-states');
  } catch (error) {
    console.error('❌ Error recalling browser states from auth-states:', error);
    throw error;
  }
};
