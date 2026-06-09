import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as shared from '../../support/utils';

const host = shared.getHost();

test('Public pages', async ({ page, dbInstanceCode }) => {
  await page.goto(host, { waitUntil: 'domcontentloaded' });

  const instanceCodeInput = page.locator('input[name="instanceCode"]');
  if (await instanceCodeInput.isVisible()) {
    await instanceCodeInput.fill(dbInstanceCode);
    await page.getByTestId('submit-instance-code').click();
    await page.waitForURL((url) => url.pathname === '/', { waitUntil: 'domcontentloaded' });
  }

  await test.step('404 page', async () => {
    await page.goto(`${host}/this-route-does-not-exist`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('not-found-view')).toBeVisible();
  });

  await test.step('Offline page', async () => {
    await page.goto(`${host}/offline`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('school-offline-view')).toBeVisible();
  });

  await test.step('About page', async () => {
    await page.goto(host, { waitUntil: 'domcontentloaded' });
    await page.getByTestId('about-button').click();
    await expect(page.getByTestId('about-view')).toBeVisible();
  });

  await test.step('Dark mode toggle', async () => {
    await page.goto(host, { waitUntil: 'domcontentloaded' });

    const html = page.locator('html');
    const initialDarkMode = await html.evaluate((el) => el.classList.contains('dark'));

    const toggleButton = page.getByTestId('dark-mode-toggle');
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    const newDarkMode = await html.evaluate((el) => el.classList.contains('dark'));
    expect(newDarkMode).toBe(!initialDarkMode);

    await toggleButton.click();
    const restoredDarkMode = await html.evaluate((el) => el.classList.contains('dark'));
    expect(restoredDarkMode).toBe(initialDarkMode);
  });

  await test.step('Language switch', async () => {
    await page.goto(host, { waitUntil: 'domcontentloaded' });

    const langButton = page.getByTestId('language-switch');
    await expect(langButton).toBeVisible();

    const initialLang = await page.evaluate(() => localStorage.getItem('lang') ?? document.documentElement.lang);

    await langButton.click();

    const otherOption = page.locator('[role="option"][aria-selected="false"]').first();
    await expect(otherOption).toBeVisible();
    await otherOption.click();

    const newLang = await page.evaluate(() => localStorage.getItem('lang'));
    expect(newLang).not.toBe(initialLang);

    await expect(langButton).toBeVisible();
  });
});
