import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as navigation from '../../interactions/navigation';
import { TEST_IDS } from '../../../src/test-ids';

const MOBILE_VIEWPORT = { width: 375, height: 667 };

// ─── Sidebar ──────────────────────────────────────────────────────────────────

test('Sidebar - always visible on desktop without any interaction', async ({ newPageFor }) => {
  const page = await newPageFor('user');
  await navigation.goToHome(page);

  await expect(page.locator('nav#sidebar-menu')).toBeVisible();
});

test('Sidebar - hidden (inert) by default on mobile viewport', async ({ newPageFor }) => {
  const page = await newPageFor('user');
  await page.setViewportSize(MOBILE_VIEWPORT);
  await navigation.goToHome(page);

  await expect(page.locator('nav#sidebar-menu')).toHaveAttribute('inert', '');
});

test('Sidebar - opens when menu button is tapped on mobile', async ({ newPageFor }) => {
  const page = await newPageFor('user');
  await page.setViewportSize(MOBILE_VIEWPORT);
  await navigation.goToHome(page);

  await page.getByTestId(TEST_IDS.TOPBAR_MENU_BUTTON).click();

  const sidebar = page.locator('nav#sidebar-menu');
  await expect(sidebar).not.toHaveAttribute('inert');
  await expect(sidebar).toBeInViewport();
});

test('Sidebar - closes when menu button is tapped again on mobile', async ({ newPageFor }) => {
  const page = await newPageFor('user');
  await page.setViewportSize(MOBILE_VIEWPORT);
  await navigation.goToHome(page);

  await page.getByTestId(TEST_IDS.TOPBAR_MENU_BUTTON).click();
  await expect(page.locator('nav#sidebar-menu')).not.toHaveAttribute('inert');

  await page.getByTestId(TEST_IDS.TOPBAR_MENU_BUTTON).click();

  await expect(page.locator('nav#sidebar-menu')).toHaveAttribute('inert', '');
});

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

test('Breadcrumb - shows Aula logo at root when no context is active', async ({ newPageFor }) => {
  const page = await newPageFor('user');
  await navigation.goToHome(page);

  await expect(page.locator('#top-bar img')).toBeVisible();
});

test('Breadcrumb - shows navigation toggle button inside a room', async ({ newPageFor, seededRoom }) => {
  const page = await newPageFor('user');
  await navigation.goToRoom(page, seededRoom.name);

  await expect(page.getByTestId(TEST_IDS.BREADCRUMB_TOGGLE)).toBeVisible();
  await expect(page.getByTestId(TEST_IDS.BREADCRUMB_TOGGLE)).toHaveAttribute('aria-haspopup', 'menu');
});

test('Breadcrumb - clicking toggle at single depth navigates home', async ({ newPageFor, seededRoom }) => {
  // At room level there is only one breadcrumb entry, so the toggle skips the
  // dropdown and navigates directly to '/' (see useBreadcrumb handleToggle).
  const page = await newPageFor('user');
  await navigation.goToRoom(page, seededRoom.name);

  await page.getByTestId(TEST_IDS.BREADCRUMB_TOGGLE).click();

  await page.waitForURL((url) => url.pathname === '/');
});

// ─── Print button ─────────────────────────────────────────────────────────────

test('Print button - present and accessible in sidebar', async ({ newPageFor }) => {
  const page = await newPageFor('user');
  await navigation.goToHome(page);

  await expect(page.getByTestId(TEST_IDS.PRINT_BUTTON)).toBeVisible();
});

test('Print button - calls window.print() on click', async ({ newPageFor }) => {
  const page = await newPageFor('user');

  await page.addInitScript(() => {
    (window as any).__printCalled = false;
    window.print = () => {
      (window as any).__printCalled = true;
    };
  });

  await navigation.goToHome(page);

  await page.getByTestId(TEST_IDS.PRINT_BUTTON).click();

  const printCalled = await page.evaluate(() => (window as any).__printCalled);
  expect(printCalled).toBe(true);
});
