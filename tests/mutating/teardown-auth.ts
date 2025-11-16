import { Page } from '@playwright/test';
import * as browsers from '../shared/interactions/browsers';
import * as shared from '../shared/shared';

interface CleanupConfig {
  service: string;
  method: string;
  deleteMethod: string;
  filterField: string;
  filterPrefix: string;
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
  console.log('Cleaning up after all tests...');

  try {
    await browsers.recall(['admin']);
    const adminPage = await browsers.getUserBrowser('admin');

    const currentUrl = adminPage.url();
    if (!currentUrl || currentUrl === 'about:blank') {
      await adminPage.goto(shared.getHost());
      await adminPage.waitForLoadState('networkidle');
    }

    const token = await adminPage.evaluate(() => localStorage.getItem('token'));
    if (!token) {
      throw new Error('Admin not authenticated');
    }

    console.info('✅ Admin browser initialized');

    for (const config of CLEANUP_CONFIGS) {
      await cleanupTestItems(adminPage, config);
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await browsers.shutdown();
  }
}

async function cleanupTestItems(page: Page, config: CleanupConfig): Promise<void> {
  const items = await fetchItems(page, config.service, config.method, config.args);
  const testItems = items?.filter((item: any) => item[config.filterField]?.startsWith(config.filterPrefix)) || [];

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
