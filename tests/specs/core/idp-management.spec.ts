import { Page } from '@playwright/test';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import { DbBackchannel } from '../../fixtures/db-backchannel';
import * as formInteractions from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';
import * as settingsInteractions from '../../interactions/settings';

/**
 * IdP Management Tests
 * Rooms and users synced from an identity provider: what admins can still edit in aula.
 * Fixtures from sql/130-idp-managed.sql: SSO student in synced room 1A, synced room 2B
 * without the student, and a local room.
 */
test.describe('IdP Management - synced rooms and SSO users', () => {
  test.beforeEach(async ({ dbInstanceCode, baselineLoaded }) => {
    const dbBackchannel = await DbBackchannel.getByInstanceCode(dbInstanceCode);
    await dbBackchannel.seedIdpManaged();
  });

  // By display name: matching on "user" would also hit the "Benutzername" header row.
  const openRoomRoles = async (page: Page, displayName: string) => {
    await navigation.goToUsersSettings(page, true);
    await settingsInteractions.openEdit({ page, filters: { option: 'displayname', value: displayName } });
    await formInteractions.clickButton(page, 'room-roles-dialog-open-button');
    const dialog = page.getByTestId('room-roles-dialog');
    await expect(dialog.getByTestId('room-role-select-1a')).toBeVisible();
    return dialog;
  };

  const roleOptions = async (page: Page, roomHash: string) => {
    await page.getByTestId(`room-role-select-${roomHash}`).locator('[role="combobox"]').click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible();
    const testIds = await listbox
      .locator('[data-testid^="room-role-option-"]')
      .evaluateAll((items) => items.map((item) => item.getAttribute('data-testid')));
    await page.keyboard.press('Escape');
    await expect(listbox).toBeHidden();
    return testIds.map((testId) => testId?.replace('room-role-option-', ''));
  };

  test('SSO user can only change the role in synced rooms', async ({ seededStudent, newPageFor }) => {
    const adminPage = await newPageFor('admin');
    const dialog = await openRoomRoles(adminPage, seededStudent.displayName);

    await test.step('Synced room the user is not in is hidden; other rooms are listed', async () => {
      await expect(dialog.getByTestId('room-role-select-idp2b')).toHaveCount(0);
      await expect(dialog.getByTestId('room-role-select-std')).toBeVisible();
      await expect(dialog.getByTestId('room-role-select-local')).toBeVisible();
    });

    await test.step('"Not in this room" is offered everywhere except the synced and standard rooms', async () => {
      expect(await roleOptions(adminPage, '1a')).not.toContain('0');
      expect(await roleOptions(adminPage, 'local')).toContain('0');
      expect(await roleOptions(adminPage, 'std')).not.toContain('0');
    });

    await test.step('Role change in the synced room saves', async () => {
      await adminPage.getByTestId('room-role-select-1a').locator('[role="combobox"]').click();
      await adminPage.getByRole('listbox').getByTestId('room-role-option-30').click();
      await dialog.getByRole('button', { name: /bestätigen|confirm/i }).click();
      await formInteractions.clickButton(adminPage, 'submit-user-form');
      await expect(adminPage.getByTestId('edit-user-form')).toBeHidden();
    });

    await test.step('Saved role and locked identity fields are kept', async () => {
      const reopened = await openRoomRoles(adminPage, seededStudent.displayName);
      await expect(reopened.getByTestId('room-role-select-1a').locator('input')).toHaveValue('30');
      await reopened.getByTestId('room-roles-dialog-cancel-button').click();
      await expect(adminPage.getByTestId('username-input')).toHaveValue(seededStudent.username);
      await expect(adminPage.getByTestId('username-input')).toBeDisabled();
    });
  });

  test('Local user can leave every room except the standard room', async ({ seededUser, newPageFor }) => {
    const adminPage = await newPageFor('admin');
    const dialog = await openRoomRoles(adminPage, seededUser.displayName);

    await expect(dialog.getByTestId('room-role-select-idp2b')).toBeVisible();
    expect(await roleOptions(adminPage, '1a')).toContain('0');

    const standardRoomOptions = await roleOptions(adminPage, 'std');
    expect(standardRoomOptions).not.toContain('0');
    expect(standardRoomOptions).toEqual(expect.arrayContaining(['10', '20', '30']));
  });

  test('Rooms table shows where each room comes from', async ({ newPageFor }) => {
    const adminPage = await newPageFor('admin');
    // The e2e stack has no v2 backend, so the provider name is served here.
    await adminPage.route('**/api/v2/auth/idp/import-status', (route) =>
      route.fulfill({ json: { ready: true, status: 'completed', provider: 'eduplaces' } })
    );
    await navigation.goToRoomsSettings(adminPage, true);

    const row = (name: string) => adminPage.locator('table tbody tr').filter({ hasText: name });
    await expect(row('e2e.class_1A')).toContainText('sso: eduplaces');
    await expect(row('e2e.idp_class_2B')).toContainText('sso: eduplaces');
    await expect(row('e2e.local_room')).toContainText('aula');
    await expect(row('e2e.local_room')).not.toContainText('sso:');
  });

  test('Room form locks name and members of synced rooms only', async ({ seededRoom, newPageFor }) => {
    const adminPage = await newPageFor('admin');

    await test.step('Synced room: name and members locked, description still saves', async () => {
      await navigation.goToRoomsSettings(adminPage, true);
      await settingsInteractions.openEdit({
        page: adminPage,
        filters: { option: 'room_name', value: seededRoom.name },
      });
      await expect(adminPage.getByTestId('room-name-input')).toHaveValue(seededRoom.name);
      await expect(adminPage.getByTestId('room-name-input')).toBeDisabled();
      await expect(adminPage.getByTestId('users-field').locator('input')).toBeDisabled();

      await formInteractions.fillMarkdownForm(adminPage, 'description_public', 'edited in aula');
      await formInteractions.clickButton(adminPage, 'room-form-submit-button');
      await expect(adminPage.getByTestId('room-name-input')).toBeHidden();
      await expect(adminPage.locator('table tbody tr').filter({ hasText: seededRoom.name })).toBeVisible();
    });

    await test.step('Local room: name and members editable', async () => {
      await settingsInteractions.openEdit({
        page: adminPage,
        filters: { option: 'room_name', value: 'e2e.local_room' },
      });
      await expect(adminPage.getByTestId('room-name-input')).toBeEnabled();
      await expect(adminPage.getByTestId('users-field').locator('input')).toBeEnabled();
    });
  });

  test('Room form saves a room without phase durations or description', async ({ newPageFor }) => {
    const adminPage = await newPageFor('admin');

    await navigation.goToRoomsSettings(adminPage, true);
    await settingsInteractions.openEdit({
      page: adminPage,
      filters: { option: 'room_name', value: 'e2e.local_room' },
    });
    await expect(adminPage.getByTestId('phase_duration_1-input')).toHaveValue('14');
    await expect(adminPage.getByTestId('phase_duration_3-input')).toHaveValue('14');

    const editRequest = adminPage.waitForRequest((request) => request.url().includes('model.php?editRoom'));
    await formInteractions.clickButton(adminPage, 'room-form-submit-button');
    expect((await editRequest).postDataJSON().arguments.description_public).toBe('');
    await expect(adminPage.getByTestId('room-name-input')).toBeHidden();
  });
});
