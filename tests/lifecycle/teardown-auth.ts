import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as shared from '../support/utils';

interface CleanupConfig {
  service: string;
  method: string;
  deleteMethod: string;
  filterField: string;
  filterPrefix: string | string[];
  idField: string;
  nameField: string;
  args?: any;
}

const CLEANUP_CONFIGS: CleanupConfig[] = [
  {
    service: 'ideas',
    method: 'getIdeas',
    deleteMethod: 'deleteIdea',
    filterField: 'title',
    filterPrefix: 'test-idea-',
    idField: 'hash_id',
    nameField: 'title',
    args: undefined,
  },
  {
    service: 'boxes',
    method: 'getBoxes',
    deleteMethod: 'deleteBox',
    filterField: 'name',
    filterPrefix: 'test-box-',
    idField: 'hash_id',
    nameField: 'name',
    args: undefined,
  },
  {
    service: 'rooms',
    method: 'getRooms',
    deleteMethod: 'deleteRoom',
    filterField: 'room_name',
    filterPrefix: 'test-room-',
    idField: 'hash_id',
    nameField: 'room_name',
    args: { offset: 0, limit: 1000, orderby: 0, asc: 0, type: 0 },
  },
  {
    service: 'groups',
    method: 'getGroups',
    deleteMethod: 'deleteGroup',
    filterField: 'group_name',
    filterPrefix: 'test-group-',
    idField: 'id',
    nameField: 'group_name',
    args: undefined,
  },
  {
    service: 'messages',
    method: 'getAllMessages',
    deleteMethod: 'deleteMessage',
    filterField: 'headline',
    filterPrefix: ['test-message-', 'Test Message', 'Test bug', 'Test comment'],
    idField: 'hash_id',
    nameField: 'headline',
    args: {},
  },
  {
    service: 'users',
    method: 'getUsers',
    deleteMethod: 'deleteUser',
    filterField: 'username',
    filterPrefix: 'test-',
    idField: 'hash_id',
    nameField: 'username',
    args: undefined,
  },
];

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

    browser = await chromium.launch();
    context = await browser.newContext({ storageState: adminStatePath });
    adminPage = await context.newPage();

    // Navigate to app if needed
    const currentUrl = adminPage.url();
    if (!currentUrl || currentUrl === 'about:blank') {
      await adminPage.goto(shared.getHost());
      await adminPage.waitForLoadState('networkidle');
    }

    // Verify admin is authenticated
    const token = await adminPage.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('Admin not authenticated');
    }

    console.info('✅ Admin browser initialized');

    // Clean up all test items
    for (const config of CLEANUP_CONFIGS) {
      await cleanupTestItems(adminPage, config);
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    // Clean up browser resources
    if (adminPage) await adminPage.close();
    if (context) await context.close();
    if (browser) await browser.close();

    // Clean up auth states
    await cleanupAuthStates();
  }
}

/**
 * Clean up auth-states directory (run-id and test user context files)
 */
async function cleanupAuthStates(): Promise<void> {
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');

  try {
    if (fs.existsSync(authStatesDir)) {
      const files = fs.readdirSync(authStatesDir);

      for (const file of files) {
        const filePath = path.join(authStatesDir, file);
        fs.unlinkSync(filePath);
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
  const testItems = items?.filter((item: any) => {
    const fieldValue = item[config.filterField];
    return fieldValue && prefixes.some(prefix => fieldValue.startsWith(prefix));
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

  for (const item of items) {
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
  }
}
