/**
 * Shared DB cleanup logic used by both globalSetup (pre-run scrub) and
 * globalTeardown (post-run scrub).  Extracting here prevents duplication
 * and ensures both callers stay in sync when new entity types are added.
 */

import { Page } from '@playwright/test';

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

export const CLEANUP_CONFIGS: CleanupConfig[] = [
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

export async function cleanupAllTestData(page: Page): Promise<void> {
  for (const config of CLEANUP_CONFIGS) {
    await cleanupTestItems(page, config);
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
