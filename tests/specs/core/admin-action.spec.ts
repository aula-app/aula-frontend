import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as formInteractions from '../../interactions/forms';
import * as navigation from '../../interactions/navigation';
import { TEST_IDS } from '../../../src/test-ids';

test('Admin configuration', async ({ newPageFor }) => {
  const adminPage = await newPageFor('admin');

  await test.step('Admin configures actions', async () => {

    await test.step('Navigate to action settings', async () => {
      await navigation.goToSettings(adminPage);
      await navigation.openAccordion(adminPage, 'config-accordion-action');
    });

    // MUI DatePicker does not support data-testid
    const startDateInput = adminPage.locator(`[name="${TEST_IDS.TIMEDCOMMAND_STARTDATE_INPUT}"]`)
    const pastDate = '01.01.2000';
    await test.step('Test past date invalid', async () => {
      // MUI date inputs are hard to fill naively programmatically, but `fill` works.
      // Default language is DE and MUI expects a localized string.
      await startDateInput.fill(pastDate);
      await expect(startDateInput).toHaveAttribute('aria-invalid', 'true');
    });

    // We could test with the default preset date = today, but an action scheduled for today
    // at 00:00 is in effectively in the past and might execute immediately, or within seconds,
    // and already not present when we GET the list in a subsequent fetch.
    // So we pick a date that is definitely in the future; the easiest way to get the proper formatting
    // is to set it one year in the future.
    const futureYear = (new Date()).getFullYear() + 1
    const futureDate = `01.01.${futureYear}`
    const futureDateFormattedInTable = `${futureYear}-01-01 00:00:00`
    await test.step('Test future action creation', async () => {
      await startDateInput.fill(futureDate);
      await expect(startDateInput).toHaveAttribute('aria-invalid', 'false');
      await formInteractions.clickButton(adminPage, TEST_IDS.TIMEDCOMMAND_CONFIRM_BUTTON);
      const timedactionTable = adminPage.getByTestId(TEST_IDS.TIMEDCOMMAND_TABLE);
      await expect(timedactionTable).toBeVisible();
      await expect(timedactionTable.getByRole('cell', { name: futureDateFormattedInTable })).toBeVisible();
    });
  });
});
