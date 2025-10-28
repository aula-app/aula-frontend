import { Locator, Page, expect } from '@playwright/test';

export const fillForm = async (page: Page, testId: string, value: string) => {
  const field = page.getByTestId(testId);
  await field.clear();
  await expect(field).toBeVisible();
  await field.fill(value);
};

export const fillMarkdownForm = async (page: Page, testId: string, value: string) => {
  const field = page.getByTestId(testId).locator('[contenteditable="true"]');
  await expect(field).toBeVisible();
  await field.fill(value);
};

export const clickButton = async (page: Page, testId: string) => {
  const button = page.getByTestId(testId);
  await expect(button).toBeVisible({ timeout: 5000 });
  await button.click({ timeout: 5000 });
};

export const openMoreOption = async (page: Page, parent: Locator) => {
  const moreButton = parent.getByTestId('idea-more-menu');
  await expect(moreButton).toBeVisible();
  await moreButton.click({ timeout: 1000 });
  await expect(parent.getByTestId('more-options')).toHaveAttribute('style', '; ?width: [1-9][0-9]+px', { timeout: 500 });
};

const openSelectDropdown = async (page: Page, testId: string) => {
  const field = page.getByTestId(testId);
  await expect(field).toBeVisible({ timeout: 5000 });

  const dropdownIcon = field.getByTestId('ArrowDropDownIcon');

  // Check if the icon has a parent button and click the button instead
  const parentButton = dropdownIcon.locator('xpath=ancestor::button[1]');
  const buttonCount = await parentButton.count();

  if (buttonCount > 0) {
    await parentButton.click();
  } else {
    // Fallback: click the icon directly if no button parent
    await dropdownIcon.click({ force: true });
  }

  await expect(page.locator('.MuiAutocomplete-popupIndicator')).toBeVisible({ timeout: 500 });

  const dropdown = page.getByTestId(`${testId}-list`);
  await expect(dropdown).toBeVisible({ timeout: 5000 });
};

const select = async (page: Page, testId: string, option: Locator) => {
  await openSelectDropdown(page, testId);
  await expect(option).toBeVisible({ timeout: 5000 });
  await option.click({ timeout: 1000 });
  await page.waitForTimeout(500);
  // await expect(page.locator('.MuiAutocomplete-popupIndicator')).toBeVisible({ visible: false, timeout: 500 });
};

export const selectOption = async (page: Page, testId: string, optionLabel: string) => {
  const option = page.getByTestId(`${testId}-list`).getByRole('option', { exact: true, name: optionLabel });
  await select(page, testId, option);

  const displayedValue = page.getByTestId(testId);
  await expect(displayedValue).toContainText(optionLabel, { timeout: 5000 });
};

export const selectOptionByValue = async (page: Page, testId: string, value: string) => {
  const option = page.getByTestId(`${testId}-list`).getByTestId(`select-option-${value}`);
  await select(page, testId, option);

  const field = page.getByTestId(`${testId}-input`);
  await expect(field).toHaveValue(value, { timeout: 5000 });
};
