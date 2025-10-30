import { test, expect, chromium } from '@playwright/test';
import { describeWithSetup, TestDataBuilder } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import { sleep } from '../../shared/utils';
import * as shared from '../../shared/shared';
import fs from 'fs';
import path from 'path';
import * as users from '../../shared/interactions/users';
import * as rooms from '../../shared/interactions/rooms';
import * as browsers from '../../shared/interactions/browsers';

// Test constants for better maintainability
const CSV_CONFIG = {
  TEMP_FILE_NAME: 'temp-upload.txt',
  TIMEOUT: 1000,
  EXPECTED_FIELDS: ['realname', 'displayname', 'username', 'email', 'about_me'],
} as const;

const USER_CONFIG = {
  TEST_USERNAME: 'jannika',
  ROOM_PREFIX: 'csv',
} as const;

// Test context interface
interface UsersCsvTestContext {
  userData: any;
  room: any;
  tempFilePath?: string;
  temporaryPassword?: string;
  userBrowserContext?: any;
  userPage?: any;
  isUserUploaded: boolean;
  isUserLoggedIn: boolean;
  isDeletionRequested: boolean;
  isDeletionApproved: boolean;
}

describeWithSetup('Upload user csv, delete that user', () => {
  // Shared context for sequential tests
  let sharedContext: UsersCsvTestContext | null = null;
  const cleanupQueue: Array<{ page: any; context: UsersCsvTestContext }> = [];

  test.afterAll(async () => {
    // Clean up shared context at the end
    if (sharedContext) {
      const admin = await BrowserHelpers.openPageForUser('admin');
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
  const setupTestContext = (): UsersCsvTestContext => ({
    userData: TestDataBuilder.createUserData(USER_CONFIG.TEST_USERNAME),
    room: TestDataBuilder.createRoom(USER_CONFIG.ROOM_PREFIX, []),
    isUserUploaded: false,
    isUserLoggedIn: false,
    isDeletionRequested: false,
    isDeletionApproved: false,
  });

  const generateCsvContent = (userData: any): string => {
    return `realname;displayname;username;email;about_me
${userData.realName};${userData.displayName};${userData.username};;${userData.about}`;
  };

  const createTempCsvFile = (csvContent: string): string => {
    const filePath = path.join(__dirname, '../../temp', CSV_CONFIG.TEMP_FILE_NAME);

    // Ensure temp directory exists
    const tempDir = path.dirname(filePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    fs.writeFileSync(filePath, csvContent);
    return filePath;
  };

  const cleanupTestData = async (page: any, context: UsersCsvTestContext): Promise<void> => {
    const errors: Error[] = [];

    // Clean up temporary CSV file
    if (context.tempFilePath && fs.existsSync(context.tempFilePath)) {
      try {
        fs.unlinkSync(context.tempFilePath);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup temp file: ${e.message}`));
      }
    }

    // Clean up room if it still exists and user wasn't deleted
    if (context.room && !context.isDeletionApproved) {
      try {
        await rooms.remove(page, context.room);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup room: ${e.message}`));
      }
    }

    // Clean up user if still exists and wasn't deleted through normal flow
    if (context.userData && context.isUserUploaded && !context.isDeletionApproved) {
      try {
        await users.remove(page, context.userData);
      } catch (e: any) {
        errors.push(new Error(`Failed to cleanup user: ${e.message}`));
      }
    }

    // Log cleanup errors but don't fail the test
    if (errors.length > 0) {
      console.warn('Cleanup warnings:', errors.map((e) => e.message).join(', '));
    }
  };

  test('Admin can upload a user csv', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      // Initialize shared context for the test suite
      sharedContext = setupTestContext();
      expect(sharedContext, 'Test context should be initialized successfully').toBeDefined();

      const csvContent = generateCsvContent(sharedContext.userData);
      const filePath = createTempCsvFile(csvContent);
      sharedContext.tempFilePath = filePath;

      const host = shared.getHost();
      await admin.goto(host);

      // Create a room for CSV import placement
      await rooms.create(admin, sharedContext.room);

      // Navigate to settings
      await users.goToSettings(admin);

      // Open user accordion
      const userAccordion = admin.getByTestId('config-accordion-user');
      await expect(userAccordion).toBeVisible();
      await userAccordion.click({ timeout: CSV_CONFIG.TIMEOUT });

      // Click upload users button
      const uploadButton = admin.getByTestId('upload-users-csv-button');
      await expect(uploadButton).toBeVisible();
      await uploadButton.click({ timeout: CSV_CONFIG.TIMEOUT });

      // Upload CSV file
      await admin.setInputFiles('input[type="file"]', filePath);

      // Select room for user placement
      const roomSelector = admin.locator('[data-testid="user-room-select"] input');
      await expect(roomSelector).toBeVisible({ timeout: 500 });
      await roomSelector.click({ timeout: CSV_CONFIG.TIMEOUT });

      // Select first available room
      await admin.getByRole('option').first().click({ timeout: CSV_CONFIG.TIMEOUT });

      // Confirm CSV upload
      const confirmButton = admin.locator('[data-testid="confirm_upload"]');
      await expect(confirmButton).toBeVisible();
      await confirmButton.click({ timeout: CSV_CONFIG.TIMEOUT });

      // Wait for processing and verify user exists
      await sleep(1);
      await users.exists(admin, sharedContext.userData);

      sharedContext.isUserUploaded = true;
      expect(sharedContext.userData, 'User data should be defined').toBeDefined();
      expect(sharedContext.room, 'Room should be created for CSV import').toBeDefined();
    } catch (error) {
      console.error('Failed to upload user CSV:', error);
      throw new Error(`CSV upload failed for user: ${USER_CONFIG.TEST_USERNAME}. Context: ${!!sharedContext}`);
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });

  test('New user can log in using admin-generated temporary password', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      expect(sharedContext, 'Shared context should exist from previous test').toBeTruthy();
      expect(sharedContext!.isUserUploaded, 'User should have been uploaded in previous test').toBe(true);

      // Create new browser context for the user
      const userBrowserContext = await (await chromium.launch()).newContext();
      const userPage = await browsers.newPage(userBrowserContext);

      sharedContext!.userBrowserContext = userBrowserContext;
      sharedContext!.userPage = userPage;

      // Get temporary password from admin
      sharedContext!.temporaryPassword = await users.getTemporaryPass(admin, sharedContext!.userData);

      // Perform first login flow
      await users.firstLoginFlow(userPage, sharedContext!.userData, sharedContext!.temporaryPassword);

      sharedContext!.isUserLoggedIn = true;
      expect(sharedContext!.temporaryPassword, 'Temporary password should be obtained').toBeDefined();
      expect(sharedContext!.userPage, 'User page should be available').toBeDefined();
    } catch (error) {
      console.error('Failed user first login:', error);
      throw new Error(`First login failed. Prerequisites: userUploaded=${!!sharedContext?.isUserUploaded}`);
    } finally {
      await BrowserHelpers.closePage(admin);
    }
  });

  test('User can request account deletion and admin can approve it', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    try {
      expect(sharedContext, 'Shared context should exist from previous tests').toBeTruthy();
      expect(sharedContext!.isUserUploaded, 'User should have been uploaded').toBe(true);
      expect(sharedContext!.isUserLoggedIn, 'User should have logged in').toBe(true);
      expect(sharedContext!.userPage, 'User page should be available').toBeDefined();

      const host = shared.getHost();
      await admin.goto(host);

      // Login if not already logged in
      if (!sharedContext!.isUserLoggedIn) {
        await users.login(sharedContext!.userPage, sharedContext!.userData);
      }

      await users.goToProfile(sharedContext!.userPage);

      // Open danger panel
      const dangerPanel = sharedContext!.userPage.getByTestId('danger-panel-button');
      await expect(dangerPanel).toBeVisible();
      await dangerPanel.click({ timeout: CSV_CONFIG.TIMEOUT });

      // Click delete account button
      const deleteButton = sharedContext!.userPage.getByTestId('delete-account-button');
      await expect(deleteButton).toBeVisible();
      await deleteButton.click({ timeout: CSV_CONFIG.TIMEOUT });

      // Handle confirmation modal
      const modal = sharedContext!.userPage.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();

      const confirmDeleteButton = modal.getByTestId('delete-button').first();
      await expect(confirmDeleteButton).toBeVisible();
      await confirmDeleteButton.click({ timeout: CSV_CONFIG.TIMEOUT });

      sharedContext!.isDeletionRequested = true;

      // Admin approves deletion
      await users.goToRequests(admin);
      await sleep(1);

      // Find deletion request using test ID
      const deletionRequestDiv = admin.getByTestId(`user-deletion-request-${sharedContext!.userData.username}`);
      await expect(deletionRequestDiv).toBeVisible();

      // Click approve button
      const approveButton = deletionRequestDiv.getByTestId('confirm-request').first();
      await expect(approveButton).toBeVisible();
      await approveButton.click({ timeout: CSV_CONFIG.TIMEOUT });

      // Handle confirmation modal
      const adminModal = admin.locator('div[role="dialog"]');
      await expect(adminModal).toBeVisible();

      const confirmButton = adminModal.getByTestId('confirm-request-action').first();
      await expect(confirmButton).toBeVisible();
      await confirmButton.click({ timeout: CSV_CONFIG.TIMEOUT });

      // Verify user no longer exists
      await expect(users.exists(admin, sharedContext!.userData)).rejects.toThrow();

      sharedContext!.isDeletionApproved = true;
      expect(sharedContext!.isDeletionRequested, 'Deletion should be requested successfully').toBe(true);
      expect(sharedContext!.isDeletionApproved, 'Deletion should be approved successfully').toBe(true);
    } catch (error) {
      console.error('Failed deletion workflow:', error);
      throw new Error(
        `Deletion workflow failed. Prerequisites: userUploaded=${!!sharedContext?.isUserUploaded}, userLoggedIn=${!!sharedContext?.isUserLoggedIn}`
      );
    } finally {
      await BrowserHelpers.closePage(admin);
      // Note: User page cleanup is handled in afterAll hook
    }
  });
});
