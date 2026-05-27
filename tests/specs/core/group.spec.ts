import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as forms from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';
import * as shared from '../../support/utils';
import * as types from '../../support/types';

/**
 * Group Management Tests
 * Tests group creation and user assignment
 * Uses pure Playwright fixtures for setup/teardown
 *
 * NOTE: Tests run serially because they form a sequential workflow:
 * 1. Create group → 2. Send message to group → 3. Verify users receive the message
 */
test('Group Management - Creation and User Assignment', async ({ seededStudent, seededUser, newPageFor }) => {
  const adminPage = await newPageFor('admin');

  const groupData: types.GroupData = entities.createGroupData([seededUser, seededStudent]);
  const messageData = {
    headline: shared.gensym(`test-message-`),
    body: `Test message sent to the group`,
  };

  await test.step('Admin - Navigate to settings and open group accordion', async () => {
    await navigation.goToSettings(adminPage);
    await navigation.openAccordion(adminPage, 'config-accordion-group');
  });

  await test.step('Admin - Click add Group button', async () => {
    await forms.clickButton(adminPage, 'add-group-chip');
    await expect(adminPage.getByTestId('group-name-field-input')).toBeVisible();
  });

  await test.step('Admin - Fill & Submit Group form', async () => {
    await forms.fillForm(adminPage, 'group-name-field', groupData.group_name);
    await forms.fillMarkdownForm(adminPage, 'description_public', groupData.description_public);
    for (const { username } of groupData.users) {
      await forms.selectMultiAutocompleteOption(adminPage, 'users-field', username);
    }
    await forms.clickButton(adminPage, 'save-group-button');
  });

  await test.step('Admin - Verify that the Group form is closed and new Group appears in the list', async () => {
    await expect(adminPage.getByTestId('group-name-field-input')).not.toBeVisible();
    await adminPage.waitForLoadState("networkidle");

    // Group is visible in the list
    const groupChip = adminPage.getByTestId('groups-chips-stack').getByText(groupData.group_name).first();
    await expect(groupChip).toBeVisible();

    // Verifying the content of the Group edit form
    await groupChip.click();
    await expect(adminPage.getByTestId('group-name-field-input')).toHaveValue(groupData.group_name);
    // @FIXME: this still doesn't pinpoint the Group Description (it could be Standard Room Description)
    await expect(adminPage.getByTestId('markdown-editor-description_public')
      .filter({ hasText: groupData.description_public }))
      .toBeVisible();
  });

  await test.step('Admin - Send message to Group', async () => {
    await navigation.goToMessagesSettings(adminPage);
    await forms.clickButton(adminPage, 'add-messages-button');
    await expect(adminPage.getByTestId('submit-message-form')).toBeVisible();

    // Change message type from user to group, fill in group and message data
    await forms.selectOptionByValue(adminPage, 'message-type-select', 'target_group');
    await forms.selectMultiAutocompleteOption(adminPage, 'group-field-autocomplete-input', groupData.group_name);
    await forms.fillForm(adminPage, 'message-headline', messageData.headline);
    await forms.fillMarkdownForm(adminPage, 'body', messageData.body);

    // Submit Message form
    await forms.clickButton(adminPage, 'submit-message-form');
  });

  await test.step('Admin - Verify message was created in admin panel', async () => {
    const messageRow = adminPage.locator('table tr').filter({ hasText: messageData.headline });
    await expect(messageRow).toBeVisible();
  });

  await test.step('User - Verify received the message', async () => {
    const userPage = await newPageFor('user');
    await navigation.goToMessages(userPage);
    const messageCard = userPage.getByText(messageData.headline);
    await expect(messageCard).toBeVisible();
  });

  await test.step('Student - Verify received the message', async () => {
    const studentPage = await newPageFor('student');
    await navigation.goToMessages(studentPage);
    const messageCard = studentPage.getByText(messageData.headline);
    await expect(messageCard).toBeVisible();
  });
});
