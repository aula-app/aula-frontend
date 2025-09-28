import { Page, expect } from '@playwright/test';

export const addFilter = async (page: Page, filter_option: string, filter_value: string) => {
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
  await page.locator(`li[data-value="${filter_option}"]`).click();
  // filter by our filter
  await page.fill('#filter-value-input', filter_value);

  await page.waitForTimeout(1000);

  // check if value was filtered correctly
  const row = page.locator('table tr').filter({ hasText: filter_value }).first();
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
  await clearFilterButton.click();
  await page.waitForTimeout(1000);

  await filterButton.click();
  await expect(clearFilterButton).not.toBeVisible();
};

export const openEdit = async (page: Page, filter_option: string, filter_value: string) => {
  const row = page.locator('table tr').filter({ hasText: filter_value }).first();
  if (!(await row.isVisible())) {
    await addFilter(page, filter_option, filter_value);
  }

  await row.click();
  await page.waitForLoadState('networkidle');
};
