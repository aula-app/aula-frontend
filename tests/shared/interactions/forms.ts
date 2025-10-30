import { Locator, Page, expect } from '@playwright/test';

export const fillForm = async (page: Page, testId: string, value: string) => {
  const field = page.getByTestId(`${testId}-input`);
  await field.clear();
  await expect(field).toBeVisible();
  await field.fill(value);
};

export const fillMarkdownForm = async (page: Page, testId: string, value: string) => {
  const field = page.getByTestId(`markdown-editor-${testId}`).locator('[contenteditable="true"]');
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
  await expect(parent.getByTestId('delete-button')).toBeVisible({ timeout: 5000 });
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

  await page.waitForTimeout(500);

  const dropdown = page.getByTestId(`${testId}-list`);
  await expect(dropdown).toBeVisible({ timeout: 5000 });
};

export const selectOption = async (page: Page, testId: string, optionLabel: string) => {
  const field = page.getByTestId(testId);
  await expect(field).toBeVisible({ timeout: 5000 });
  await openSelectDropdown(page, testId);

  const option = page.getByTestId(`${testId}-list`).getByRole('option', { exact: false, name: optionLabel });
  await expect(option).toBeVisible({ timeout: 5000 });
  await option.click({ timeout: 1000 });

  const displayedValue = page.getByTestId(testId);
  await expect(displayedValue).toBeVisible({ timeout: 5000 });
  await expect(displayedValue).toContainText(optionLabel, { timeout: 5000 });
};

export const selectAutocompleteOption = async (page: Page, testId: string, optionLabel: string) => {
  const option = page.getByTestId(`${testId}-list`).getByRole('option', { exact: false, name: optionLabel });
  await openSelectDropdown(page, testId);
  await expect(option).toBeVisible({ timeout: 5000 });
  await option.click({ timeout: 1000 });

  const displayedValue = page.getByTestId(`${testId}-input`);
  await expect(displayedValue).toBeVisible({ timeout: 5000 });
  await expect(displayedValue).toHaveValue(optionLabel, { timeout: 5000 });
};

export const selectOptionByValue = async (page: Page, testId: string, value: string) => {
  // First, get the option element and read its text content
  const field = page.getByTestId(testId);
  await expect(field).toBeVisible({ timeout: 5000 });
  await field.click();

  const option = page.getByTestId(`${testId}-list`).getByTestId(`select-option-${value}`);
  await expect(option).toBeVisible({ timeout: 5000 });

  // Read the text content of the option before selecting it
  const optionText = await option.textContent();
  if (!optionText) {
    throw new Error(`Could not read text content for option with value ${value}`);
  }

  // Now select the option
  await option.click({ timeout: 1000 });
  await page.waitForTimeout(500);

  // Verify the selection by checking if the field now contains the option text
  const displayedValue = page.getByTestId(testId);
  await expect(displayedValue).toContainText(optionText.trim(), { timeout: 5000 });
};
