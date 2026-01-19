import { test, expect } from '../../fixtures/test-fixtures';
import * as navigation from '../../interactions/navigation';
import * as forms from '../../interactions/forms';
import * as shared from '../../support/utils';

/**
 * Group Management Tests
 * Tests group creation and user assignment
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * 1. Create group → 2. Send message to group → 3. Verify users receive the message
 */
test.describe.serial('Group Management - Creation and User Assignment', () => {
  let groupData: {
    group_name: string;
    description_public: string;
    users: string[];
    messageData: {
      headline: string;
      body: string;
    };
  };

  test.beforeAll(async ({ userConfig, studentConfig }) => {
    groupData = {
      group_name: shared.gensym(`test-group-`),
      description_public: `test group created in e2e tests`,
      users: [userConfig.username, studentConfig.username],
      messageData: {
        headline: shared.gensym(`test-message-`),
        body: `Test message sent to the group`,
      },
    };
  });

  test('Admin can create a group', async ({ adminPage }) => {
    await test.step('Navigate to settings and open group accordion', async () => {
      await navigation.goToSettings(adminPage);
      await navigation.openAccordion(adminPage, 'config-accordion-group');
    });

    await test.step('Click add group button', async () => {
      await forms.clickButton(adminPage, 'add-group-chip');
      await adminPage.waitForTimeout(500);
    });

    await test.step('Fill group form with name and description', async () => {
      await forms.fillForm(adminPage, 'group-name-field', groupData.group_name);

      // Scope the markdown editor to the form to avoid conflicts with other markdown editors on the page
      const form = adminPage.locator('form').first();
      await forms.fillMarkdownForm(adminPage, 'description_public', groupData.description_public, form);
    });

    await test.step('Add users to group', async () => {
      for (const username of groupData.users) {
        await forms.selectMultiAutocompleteOption(adminPage, 'users-field', username);
      }
    });

    await test.step('Save group', async () => {
      await forms.clickButton(adminPage, 'save-group-button');
      await adminPage.waitForLoadState('networkidle');
      await adminPage.waitForTimeout(1000);
    });

    await test.step('Verify that the new group appears in the list', async () => {
      const groupChip = adminPage.getByTestId('groups-chips-stack').getByText(groupData.group_name).first();
      await expect(groupChip).toBeVisible();
    });
  });

  test('Admin can send a message to the group', async ({ adminPage }) => {
    await test.step('Navigate to messages settings', async () => {
      await navigation.goToMessagesSettings(adminPage);
    });

    await test.step('Click add message button', async () => {
      await forms.clickButton(adminPage, 'add-messages-button');
      await adminPage.waitForTimeout(500);
    });

    await test.step('Select group as message target', async () => {
      // Change message type from user to group
      await forms.selectOptionByValue(adminPage, 'message-type-select', 'target_group');
    });

    await test.step('Select the group', async () => {
      await forms.selectMultiAutocompleteOption(adminPage, 'group-field-autocomplete-input', groupData.group_name);
    });

    await test.step('Fill message form', async () => {
      await forms.fillForm(adminPage, 'message-headline', groupData.messageData.headline);

      // Scope the markdown editor to the form
      const form = adminPage.locator('form').first();
      await forms.fillMarkdownForm(adminPage, 'body', groupData.messageData.body, form);
    });

    await test.step('Submit message', async () => {
      await forms.clickButton(adminPage, 'submit-message-form');
      await adminPage.waitForLoadState('networkidle');
      await adminPage.waitForTimeout(1000);
    });

    await test.step('Verify message was created in admin panel', async () => {
      const messageRow = adminPage.locator('table tr').filter({ hasText: groupData.messageData.headline });
      await expect(messageRow).toBeVisible();
    });
  });

  test('Users in group receive the message', async ({ userPage, studentPage }) => {
    await test.step('Verify user received the message', async () => {
      await navigation.goToMessages(userPage);
      await userPage.waitForLoadState('networkidle');

      const messageCard = userPage.getByText(groupData.messageData.headline);
      await expect(messageCard).toBeVisible({ timeout: 10000 });
    });

    await test.step('Verify student received the message', async () => {
      await navigation.goToMessages(studentPage);
      await studentPage.waitForLoadState('networkidle');

      const messageCard = studentPage.getByText(groupData.messageData.headline);
      await expect(messageCard).toBeVisible({ timeout: 10000 });
    });
  });
});
