import { expect, test } from '@playwright/test';
import { describeWithSetup, TestDataBuilder } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import * as rooms from '../../shared/interactions/rooms';

// Test constants for better maintainability
const TEST_USERS = {
  ADMIN: 'admin',
  BURT: 'burt',
  ALICE: 'alice',
  MALLORY: 'mallory',
} as const;

// Test context interface
interface RoomManagementTestContext {
  room: any;
  isRoomCreated: boolean;
}

describeWithSetup('Room Management - Creation and Permissions', () => {
  // Shared context for sequential tests
  let sharedContext: RoomManagementTestContext | null = null;
  const cleanupQueue: Array<{ page: any; context: RoomManagementTestContext }> = [];

  test.afterAll(async () => {
    // Clean up shared context at the end
    if (sharedContext && sharedContext.isRoomCreated) {
      const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);
      try {
        await cleanupTestData(admin, sharedContext);
      } catch (e) {
        console.warn('Shared context cleanup failed:', e);
      } finally {
        await BrowserHelpers.closePage(admin);
      }
    }

    // Emergency cleanup for any leftover contexts
    while (cleanupQueue.length > 0) {
      const { page, context } = cleanupQueue.pop()!;
      try {
        await cleanupTestData(page, context);
      } catch (e) {
        console.warn('Emergency cleanup failed:', e);
      }
    }
  });

  // Helper functions
  const setupTestContext = (): RoomManagementTestContext => ({
    room: TestDataBuilder.createRoom(),
    isRoomCreated: false,
  });

  const cleanupTestData = async (page: any, context: RoomManagementTestContext): Promise<void> => {
    if (context.room && context.isRoomCreated) {
      try {
        await rooms.remove(page, context.room);
      } catch (e: any) {
        console.warn(`Failed to cleanup room: ${e.message}`);
      }
    }
  };

  const testUserCannotCreateRoom = async (username: keyof typeof TEST_USERS): Promise<void> => {
    const userPage = await BrowserHelpers.openPageForUser(TEST_USERS[username]);

    try {
      expect(sharedContext, 'Shared context should be initialized').toBeTruthy();

      await expect(async () => {
        await rooms.create(userPage, sharedContext!.room);
      }).rejects.toThrow();
    } catch (error) {
      console.error(`Failed to test ${TEST_USERS[username]} room creation restriction:`, error);
      throw new Error(`Room creation restriction test failed for user: ${TEST_USERS[username]}`);
    } finally {
      await BrowserHelpers.closePage(userPage);
    }
  };

  test('Admin can create a room with users', async () => {
    const admin = await BrowserHelpers.openPageForUser(TEST_USERS.ADMIN);

    try {
      // Initialize shared context for the test suite
      sharedContext = setupTestContext();
      expect(sharedContext, 'Test context should be initialized successfully').toBeDefined();

      await rooms.create(admin, sharedContext.room);
      sharedContext.isRoomCreated = true;

      expect(sharedContext.room, 'Room should be created successfully').toBeDefined();
    } catch (error) {
      console.error('Failed to create room:', error);
      throw new Error(`Room creation failed for admin. Room data: ${!!sharedContext?.room}`);
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });

  test('Burt cannot create a room', async () => {
    await testUserCannotCreateRoom('BURT');
  });

  test('Alice cannot create a room', async () => {
    await testUserCannotCreateRoom('ALICE');
  });

  test('Mallory cannot create a room', async () => {
    await testUserCannotCreateRoom('MALLORY');
  });
});
