import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as shared from '../../support/utils';

const host = shared.getHost();

// The tree tenants are "seeded" via artisan commands in docker-compose.e2e.yaml
// We do not use newPageFor in these, we don't want to be logged in yet.

// Un-skip when https://github.com/aula-app/aula-frontend/pull/1319 lands
//   = when e2e can access /api/v2
test.describe('Name search / instance code', () => {
  test.skip('Search by name, use keyboard to select', async ({ page }) => {
    await page.goto(host, { waitUntil: 'domcontentloaded' });
    const combobox = await page.getByRole('combobox', { name: 'Name der Schule (oder Instanzcode)' });
    combobox.focus();
    await combobox.fill('E');
    await expect(page.getByRole('option', { name: 'E2E.0' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'E2E.1' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'E2E.2' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Instanzcode E' })).toBeVisible();
    await combobox.fill('E2E.0');
    await expect(page.getByRole('option', { name: 'E2E.0' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'E2E.1' })).toBeHidden();
    await page.getByRole('option', { name: 'E2E.0' }).click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const currentInstanceCode = page.getByTestId('current-instance-code');
    await expect(currentInstanceCode).toBeVisible();
  });

  test.skip('Enter instance code', async ({ page }) => {
    await page.goto(host, { waitUntil: 'domcontentloaded' });
    const combobox = await page.getByRole('combobox', { name: 'Name der Schule (oder Instanzcode)' });
    combobox.focus();
    await combobox.fill('db000');
    const option = page.getByRole('option', { name: 'Instanzcode db000' });
    await expect(option).toBeVisible();
    await expect(page.getByRole('option', { name: 'E2E.0' })).toBeHidden();
    await option.click();
    await page.getByTestId('submit-instance-code').click();
    await expect(page.getByTestId('current-instance-code')).toBeVisible();
  });

  test.skip('Enter non-existing instance code', async ({ page }) => {
    await page.goto(host, { waitUntil: 'domcontentloaded' });
    const combobox = await page.getByRole('combobox', { name: 'Name der Schule (oder Instanzcode)' });
    combobox.focus();
    await combobox.fill('abcde');
    await page.getByRole('option', { name: 'Instanzcode abcde' }).click();
    await page.getByTestId('submit-instance-code').click();
    await expect(page.getByTestId('error-alert')).toBeVisible();
  });
});
