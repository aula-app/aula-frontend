import { Browser, BrowserContext, chromium, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { FILTER_EXCLUDED_RESOURCES } from '../fixtures/browser.fixture';
import * as shared from '../support/utils';
import { cleanupAllTestData } from './cleanup';

export default async function globalTeardown() {
  console.log('🧹 Starting global teardown...');

  let browser: Browser | null = null;
  let context: BrowserContext | null = null;
  let adminPage: Page | null = null;

  try {
    // Launch browser with admin authentication
    const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
    const adminStatePath = path.join(authStatesDir, 'admin-context.json');

    if (!fs.existsSync(adminStatePath)) {
      console.warn('⚠️ Admin state not found, skipping cleanup');
      return;
    }

    if (process.env.REMOTE_BROWSER === "1") {
      browser = await chromium.connect(process.env.PW_TEST_CONNECT_WS_ENDPOINT);
    } else {
      browser = await chromium.launch();
    }
    context = await browser.newContext({ storageState: adminStatePath });
    adminPage = await context.newPage();
    await adminPage.route('**/*', FILTER_EXCLUDED_RESOURCES);

    const currentUrl = adminPage.url();
    if (!currentUrl || currentUrl === 'about:blank') {
      await adminPage.goto(shared.getHost(), { waitUntil: 'domcontentloaded' });
    }

    const token = await adminPage.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('Admin not authenticated');
    }

    console.info('✅ Admin browser initialized');
    await cleanupAllTestData(adminPage);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    if (adminPage) await adminPage.close();
    if (context) await context.close();
    if (browser) await browser.close();
    await cleanupAuthStates();
  }
}

async function cleanupAuthStates(): Promise<void> {
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
  try {
    if (fs.existsSync(authStatesDir)) {
      for (const file of fs.readdirSync(authStatesDir)) {
        fs.unlinkSync(path.join(authStatesDir, file));
        console.info(`  ✅ Deleted: ${file}`);
      }
      console.info('🧹 Cleaned up auth-states directory');
    }
  } catch (error) {
    console.error('❌ Error cleaning up auth-states:', error);
  }
}

async function cleanupTestItems(page: Page, config: CleanupConfig): Promise<void> {
  const items = await fetchItems(page, config.service, config.method, config.args);

  const prefixes = Array.isArray(config.filterPrefix) ? config.filterPrefix : [config.filterPrefix];
  const testItems =
    items?.filter((item: any) => {
      const fieldValue = item[config.filterField];
      return fieldValue && prefixes.some((prefix) => fieldValue.startsWith(prefix));
    }) || [];

  console.info(`🧹 Found ${testItems.length} test ${config.service} to clean up`);

  await deleteItems(page, testItems, config.service, config.deleteMethod, config.idField, config.nameField);
}

/**
 * Generic function to fetch items from the database
 */
async function fetchItems(page: Page, serviceName: string, methodName: string, args: any): Promise<any[]> {
  const result = await page.evaluate(
    async ({ service, method, arguments: args }) => {
      const module = await import(`../../src/services/${service}`);
      const response = await module[method](args);
      return {
        data: response.data,
        error: response.error,
        count: response.count,
      };
    },
    { service: serviceName, method: methodName, arguments: args }
  );

  return result.data || [];
}

/**
 * Generic function to delete items from the database
 */
async function deleteItems(
  page: Page,
  items: any[],
  serviceName: string,
  methodName: string,
  idField: string,
  nameField: string
): Promise<void> {
  if (items.length === 0) return;

  await Promise.all(
    items.map(async (item) => {
      try {
        await page.evaluate(
          async ({ service, method, id }) => {
            const module = await import(`../../src/services/${service}`);
            await module[method](id);
          },
          { service: serviceName, method: methodName, id: item[idField] }
        );
        console.info(`  ✅ Deleted: ${item[nameField]}`);
      } catch (error) {
        console.warn(`  ⚠️ Failed to delete: ${item[nameField]}`, error);
      }
    })
  );
}
