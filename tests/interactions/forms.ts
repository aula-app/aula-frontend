import { Locator, Page, expect } from '@playwright/test';
import { TIMEOUTS } from '../support/constants';

export const fillForm = async (page: Page, testId: string, value: string) => {
  const field = page.getByTestId(`${testId}-input`);
  await field.clear();
  await expect(field).toBeVisible();
  await field.fill(value);
};

export const fillMarkdownForm = async (page: Page, testId: string, value: string, parent?: Locator) => {
  const container = parent || page;
  const field = container.getByTestId(`markdown-editor-${testId}`).locator('[contenteditable="true"]');
  await expect(field).toBeVisible();
  await field.fill(value);
};

export const clickButton = async (page: Page, testId: string) => {
  const button = page.getByTestId(testId);
  await expect(button).toBeVisible();
  await button.click();
};

export const openMoreOption = async (page: Page, parent: Locator) => {
  const moreButton = parent.getByTestId('idea-more-menu');
  await expect(moreButton).toBeVisible();
  await moreButton.click();
  await expect(parent.getByTestId('report-button')).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
};

const openSelectDropdown = async (page: Page, testId: string) => {
  const field = page.getByTestId(testId);
  await expect(field).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });

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

  const dropdown = page.getByTestId(`${testId}-list`);
  await expect(dropdown).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
};

export const selectOption = async (page: Page, testId: string, optionLabel: string) => {
  const field = page.getByTestId(testId);
  await expect(field).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await openSelectDropdown(page, testId);

  const option = page.getByTestId(`${testId}-list`).getByRole('option', { exact: false, name: optionLabel });
  await expect(option).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await option.click({ timeout: TIMEOUTS.ONE_SECOND });

  const displayedValue = page.getByTestId(testId);
  await expect(displayedValue).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await expect(displayedValue).toContainText(optionLabel, { timeout: TIMEOUTS.THREE_SECONDS });
};

export const selectAutocompleteOption = async (page: Page, testId: string, optionLabel: string) => {
  const option = page.getByTestId(`${testId}-list`).getByRole('option', { exact: false, name: optionLabel });
  await openSelectDropdown(page, testId);
  await expect(option).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await option.click({ timeout: TIMEOUTS.ONE_SECOND });

  const displayedValue = page.getByTestId(`${testId}-input`);
  await expect(displayedValue).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await expect(displayedValue).toHaveValue(optionLabel, { timeout: TIMEOUTS.THREE_SECONDS });
};

export const selectOptionByValue = async (page: Page, testId: string, value: string) => {
  // First, get the option element and read its text content
  const field = page.getByTestId(testId);
  await expect(field).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await field.click();

  const option = page.getByTestId(`${testId}-list`).getByTestId(`select-option-${value}`);
  await expect(option).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });

  // Read the text content of the option before selecting it
  const optionText = await option.textContent();
  if (!optionText) {
    throw new Error(`Could not read text content for option with value ${value}`);
  }

  // Now select the option
  await option.click({ timeout: TIMEOUTS.ONE_SECOND });

  // Verify the selection by checking if the field now contains the option text
  const displayedValue = page.getByTestId(testId);
  await expect(displayedValue).toContainText(optionText.trim(), { timeout: TIMEOUTS.THREE_SECONDS });
};

export const selectMultiAutocompleteOption = async (page: Page, testId: string, optionId: string) => {
  const field = page.getByTestId(testId);
  await expect(field).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await field.click();

  const option = page.getByTestId(`select-option-${optionId}`);
  await expect(option).toBeVisible({ timeout: TIMEOUTS.THREE_SECONDS });
  await option.click({ timeout: TIMEOUTS.ONE_SECOND });
};
