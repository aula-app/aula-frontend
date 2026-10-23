import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as messages from '../../interactions/messages';
import * as navigation from '../../interactions/navigation';
import * as reporting from '../../interactions/reporting';
import * as users from '../../interactions/users';
import * as shared from '../../support/utils';

/**
 * Messages inbox Tests (v2 /messages)
 * Reading by deep link, type filtering, archiving, and resolving the
 * name-change requests users file from their profile.
 */

test('User reads a message through its deep link', async ({ seededUser, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  const message = {
    user: seededUser,
    title: shared.gensym('test-message-'),
    content: 'Inbox message body ' + shared.gensym(),
  };

  await test.step('Admin sends the User a message', async () => {
    await messages.create(adminPage, message);
  });

  await test.step('The dashboard flags the new message', async () => {
    await navigation.goToHome(userPage);
    await expect(navigation.dashboardActivityLink(userPage, '/messages')).toHaveAccessibleName(/\b1\b/);
  });

  await test.step('Opening the card shows the body, with no archive action for a User', async () => {
    await messages.open(userPage, message.title);

    const Detail = userPage.getByTestId('message-detail-messages');
    await expect(Detail).toContainText(message.content);
    await expect(Detail.getByTestId(TEST_IDS.ARCHIVE_MESSAGE_BUTTON)).toHaveCount(0);
    await expect(messages.card(userPage, message.title).getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  await test.step('Reloading the deep link keeps the message open', async () => {
    await userPage.reload();
    await expect(userPage.getByTestId('message-detail-messages')).toContainText(message.content);
  });

  await test.step('An unknown message id shows the not-found state', async () => {
    await userPage.goto(`${shared.getHost()}/messages/not-a-real-message`);
    await expect(userPage.getByTestId('message-not-found-state')).toBeVisible();
  });
});

test('Admin filters the inbox by type and archives from the card', async ({ newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  const bugReport = 'Inbox bug ' + shared.gensym();
  const requestedName = shared.gensym('name-');

  const SearchField = adminPage.getByTestId(TEST_IDS.SEARCH_FIELD);
  const BugCards = adminPage.locator('[data-testid^="message-bugs-"]');
  const RequestCards = adminPage.locator('[data-testid^="message-requests-"]');

  await test.step('User reports a bug and requests a new display name', async () => {
    await reporting.reportBug(userPage, bugReport);
    await users.requestProfileChange(userPage, 'displayname', requestedName);
  });

  await test.step('Admin sees both in the inbox', async () => {
    await reporting.searchMessages(adminPage, bugReport);
    await expect(BugCards).toHaveCount(1);

    await SearchField.fill(requestedName);
    await expect(RequestCards).toHaveCount(1);
  });

  await test.step('Removing a type from the filter hides its messages', async () => {
    await SearchField.fill('');
    await expect(RequestCards.first()).toBeVisible();

    await adminPage.getByTestId(`${TEST_IDS.MESSAGE_TYPE_FILTER}-remove-requests`).click();

    await expect(RequestCards).toHaveCount(0);
    await expect(BugCards.first()).toBeVisible();
  });

  await test.step('Closing the controls restores every type', async () => {
    await adminPage.getByTestId(TEST_IDS.SEARCH_BUTTON).click();
    await expect(RequestCards.first()).toBeVisible();
  });

  await test.step('A pending request offers no archive action on its card', async () => {
    await reporting.searchMessages(adminPage, requestedName);
    await expect(RequestCards).toHaveCount(1);
    await expect(RequestCards.getByRole('button')).toHaveCount(0);
  });

  await test.step('Admin archives the bug report from its card', async () => {
    await reporting.searchMessages(adminPage, bugReport);
    await BugCards.getByRole('button').click();

    await reporting.expectNoMessages(adminPage);
  });
});

test('Admin confirms a requested name change', async ({ newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  const requestedName = shared.gensym('name-');

  await test.step('User requests a new display name', async () => {
    await users.requestProfileChange(userPage, 'displayname', requestedName);
  });

  await test.step('Admin confirms it through the confirmation dialog', async () => {
    await reporting.findMessage(adminPage, requestedName);
    await adminPage.getByTestId(TEST_IDS.CONFIRM_REQUEST_BUTTON).click();

    const dialog = adminPage.getByTestId(TEST_IDS.CONFIRM_REQUEST_DIALOG);
    await expect(dialog).toBeVisible();
    await dialog.getByTestId(TEST_IDS.CONFIRM_REQUEST_ACTION).click();
    await expect(dialog).toBeHidden();
  });

  await test.step('The request leaves the admin inbox', async () => {
    await reporting.searchMessages(adminPage, requestedName);
    await reporting.expectNoMessages(adminPage);
  });

  await test.step("The User's display name is changed", async () => {
    await navigation.goToProfile(userPage, true);
    await expect(userPage.locator('#profile-displayname')).toHaveValue(requestedName);
  });

  await test.step('The User gets a reply without request actions', async () => {
    await reporting.findMessage(userPage, requestedName);
    await expect(userPage.getByTestId(TEST_IDS.CONFIRM_REQUEST_BUTTON)).toHaveCount(0);
  });
});

test('Admin rejects a requested name change', async ({ seededUser, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  const requestedName = shared.gensym('name-');

  await test.step('User requests a new display name', async () => {
    await users.requestProfileChange(userPage, 'displayname', requestedName);
  });

  await test.step('Cancelling the confirmation dialog keeps the request open', async () => {
    await reporting.findMessage(adminPage, requestedName);
    await adminPage.getByTestId(TEST_IDS.CONFIRM_REQUEST_BUTTON).click();
    await adminPage.getByTestId(TEST_IDS.CONFIRM_REQUEST_CANCEL).click();

    await expect(adminPage.getByTestId(TEST_IDS.CONFIRM_REQUEST_DIALOG)).toBeHidden();
    await expect(adminPage.getByTestId(TEST_IDS.REJECT_REQUEST_BUTTON)).toBeVisible();
  });

  await test.step('Admin rejects it', async () => {
    await adminPage.getByTestId(TEST_IDS.REJECT_REQUEST_BUTTON).click();
    // Resolving closes the detail; leaving earlier would abort the reply and archive calls.
    await adminPage.waitForURL((url) => url.pathname === '/messages');

    await reporting.searchMessages(adminPage, requestedName);
    await reporting.expectNoMessages(adminPage);
  });

  await test.step("The User's display name is unchanged", async () => {
    await navigation.goToProfile(userPage, true);
    await expect(userPage.locator('#profile-displayname')).toHaveValue(seededUser.displayName);
  });

  await test.step('The User gets a reply', async () => {
    await reporting.findMessage(userPage, requestedName);
  });
});
