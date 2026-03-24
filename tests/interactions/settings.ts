import { Locator, Page, expect } from '@playwright/test';
import * as formInteractions from './forms';
import { ScopeKeyType } from '../../src/types/Scopes';
import { TIMEOUTS } from '../support/constants';

export const check = async (page: Page, filters: { option: string; value: string }): Promise<Locator> => {
  const row = page.locator('table tr').filter({ hasText: filters.value }).first();

  // Try to find the row with a very short timeout first
  try {
    await expect(row).toBeVisible({ timeout: TIMEOUTS.HALF_SECOND });
  } catch {
    // If not found quickly (e.g., due to pagination), apply filter
    await filter(page, filters);
  }

  await expect(row).toBeVisible();
  return row;
};

export const filter = async (page: Page, filter: { option: string; value: string }) => {
  const filterButton = page.getByTestId('filter-toggle-button');
  const filterInput = page.getByTestId('filter-input');
  await expect(filterButton).toBeVisible();

  if (
    !(await filterInput.isVisible()) ||
    (await page.getByTestId('filter-panel').getAttribute('style'))?.includes('; height: 0px')
  ) {
    // open the filter menu if it's not already open
    await filterButton.click();
  }
  await expect(filterInput).toBeVisible();
  await expect(page.locator('#filter-value-input')).toBeVisible();

  // select the correct filter option from the "filter by" dropdown
  await page.getByTestId('filter-select').click();
  await page.locator(`li[data-value="${filter.option}"]`).click();
  // filter by our filter
  await page.fill('#filter-value-input', filter.value);

  // check if value was filtered correctly
  const row = page.locator('table tr').filter({ hasText: filter.value }).first();
  await expect(row).toBeVisible();
};

/**
 * Apply filter on any page with FilterBar component (works for both table and card views)
 * @param page - Page object
 * @param filter - Filter configuration with option (field name) and value
 */
export const applyFilter = async (page: Page, filter: { option: string; value: string }) => {
  const filterButton = page.getByTestId('filter-toggle-button');
  const filterInput = page.getByTestId('filter-input');
  await expect(filterButton).toBeVisible();

  if (
    !(await filterInput.isVisible()) ||
    (await page.getByTestId('filter-panel').getAttribute('style'))?.includes('; height: 0px')
  ) {
    // open the filter menu if it's not already open
    await filterButton.click();
  }
  await expect(filterInput).toBeVisible();
  await expect(page.locator('#filter-value-input')).toBeVisible();

  // select the correct filter option from the "filter by" dropdown
  await page.getByTestId('filter-select').click();
  await page.locator(`li[data-value="${filter.option}"]`).click();
  // filter by our filter
  await page.fill('#filter-value-input', filter.value);
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
    await expect(page.locator('#filter-value-input')).toHaveValue('');
  }

  await filterButton.click();
};

export const openEdit = async ({ page, filters }: { page: Page; filters: { option: string; value: string } }) => {
  const row = page.locator('table tr').filter({ hasText: filters.value }).first();

  // Try to find the row with a very short timeout first
  try {
    await expect(row).toBeVisible({ timeout: TIMEOUTS.HALF_SECOND });
  } catch {
    // If not found quickly (e.g., due to pagination), apply filter
    await filter(page, filters);
  }

  await row.click();
};

export const remove = async ({
  page,
  scope,
  filters,
}: {
  page: Page;
  scope: ScopeKeyType;
  filters: { option: string; value: string };
}) => {
  const row = page.locator('table tr').filter({ hasText: filters.value }).first();

  // Try to find the row with a very short timeout first
  try {
    await expect(row).toBeVisible({ timeout: TIMEOUTS.HALF_SECOND });
  } catch {
    // If not found quickly (e.g., due to pagination), apply filter
    await filter(page, filters);
  }

  const DeleteCheckbox = row.locator('input[type="checkbox"]');
  await expect(DeleteCheckbox).toBeVisible();
  if (!(await DeleteCheckbox.isChecked())) {
    await DeleteCheckbox.click({ timeout: TIMEOUTS.ONE_SECOND });
  }
  await expect(DeleteCheckbox).toBeChecked();

  formInteractions.clickButton(page, `remove-${scope}-button`);

  const Dialog = page.getByRole('dialog');
  await expect(Dialog).toBeVisible();

  formInteractions.clickButton(page, `confirm-delete-${scope}-button`);

  // check if the row is gone
  await expect(row).toHaveCount(0);
  await clearFilter(page);
};
