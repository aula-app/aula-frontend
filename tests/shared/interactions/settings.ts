import { Page, expect } from '@playwright/test';
import * as formInteractions from './forms';
import { ScopeKeyType } from '../../../src/types/Scopes';

export const checkRow = async (page: Page, filter: { option: string; value: string }) => {
  const row = page.locator('table tr').filter({ hasText: filter.value }).first();
  if (!(await row.isVisible())) {
    await addFilter(page, filter);
  }
  await expect(row).toBeVisible();
};

export const addFilter = async (page: Page, filter: { option: string; value: string }) => {
  const filterButton = page.getByTestId('filter-toggle-button');
  const filterInput = page.getByTestId('filter-input');
  await expect(filterButton).toBeVisible();

  if (!(await filterInput.isVisible())) {
    // open the filter menu if it's not already open
    await filterButton.click();
  }

  await expect(filterInput).toBeVisible();
  // select the correct filter option from the "filter by" dropdown
  await page.getByTestId('filter-select').click();
  await page.locator(`li[data-value="${filter.option}"]`).click();
  // filter by our filter
  await page.fill('#filter-value-input', filter.value);

  await page.waitForTimeout(1000);

  // check if value was filtered correctly
  const row = page.locator('table tr').filter({ hasText: filter.value }).first();
  await expect(row).toBeVisible();
};

export const clearFilter = async (page: Page) => {
  const filterButton = page.getByTestId('filter-toggle-button');
  const clearFilterButton = page.getByTestId('clear-filter-button');
  await expect(filterButton).toBeVisible();

  if (!(await clearFilterButton.isVisible())) {
    // open the filter menu if it's not already open
    await filterButton.click();
  }

  await expect(clearFilterButton).toBeVisible();
  if (!(await clearFilterButton.isDisabled())) {
    await clearFilterButton.click();
    await page.waitForTimeout(1000);
  }

  await filterButton.click();
};

export const openEdit = async ({ page, filter }: { page: Page; filter: { option: string; value: string } }) => {
  const row = page.locator('table tr').filter({ hasText: filter.value }).first();
  if (!(await row.isVisible())) {
    await addFilter(page, filter);
  }

  await row.click();
  await page.waitForLoadState('networkidle');
};

export const remove = async ({
  page,
  scope,
  filter,
}: {
  page: Page;
  scope: ScopeKeyType;
  filter: { option: string; value: string };
}) => {
  const row = page.locator('table tr').filter({ hasText: filter.value }).first();
  if (!(await row.isVisible())) {
    await addFilter(page, filter);
  }

  const DeleteCheckbox = row.locator('input[type="checkbox"]');
  await expect(DeleteCheckbox).toBeVisible();
  if (!(await DeleteCheckbox.isChecked())) {
    await DeleteCheckbox.click({ timeout: 1000 });
  }
  await expect(DeleteCheckbox).toBeChecked();

  formInteractions.clickButton(page, `remove-${scope}-button`);

  const Dialog = page.getByRole('dialog');
  await expect(Dialog).toBeVisible();

  formInteractions.clickButton(page, `confirm-delete-${scope}-button`);
  await page.waitForTimeout(2000); // wait for the form to process

  // check if the row is gone
  await expect(row).toHaveCount(0);
  await clearFilter(page);
};
