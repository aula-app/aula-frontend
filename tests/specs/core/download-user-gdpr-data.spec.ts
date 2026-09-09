import * as formInteractions from '../../interactions/forms';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as navigation from '../../interactions/navigation';

test('Download User GDPR Data', async ({ newPageFor }) => {
  const userPage = await newPageFor('user');

  await test.step('User can request user data export', async () => {
    await navigation.goToProfile(userPage);

    // Open the danger panel accordion
    await navigation.openAccordion(userPage, 'privacy-panel-button');

    // Click the download button
    const downloadButton = userPage.getByTestId('download-user-gdpr-data-button');
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();

    // Wait for download to complete
    const download = await userPage.waitForEvent('download', { timeout: 30_000 });
    const filename = download.suggestedFilename();

    expect(filename).toBeDefined();
    expect(filename).toContain('data_export');
    // @TODO: Verify the content of the downloaded data export
  });
});
