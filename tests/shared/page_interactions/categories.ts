import { Page, expect } from '@playwright/test';
import * as users from './users';
import * as shared from '../shared';

export class CategoriesPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private get selectors() {
    return {
      configAccordionIdea: 'config-accordion-idea',
      addCategoryButton: 'add-new-category-chip',
      categoryForm: 'category-forms',
      categoryNameInput: 'input[name="name"]',
      iconField: 'icon-field-1',
      submitButton: '[data-testid="category-forms"] button[type="submit"]',
      deleteDialog: '[role="dialog"]',
      deleteConfirmButton: 'delete-cat-button',
      cancelIcon: 'CancelIcon',
      deleteIcon: '.MuiChip-deleteIcon'
    };
  }

  private get timeouts() {
    return {
      default: 10000,
      short: 5000,
      wait: 1000,
      create: 2000
    };
  }

  async navigateToSettings(): Promise<void> {
    await this.page.goto(shared.getHost());
    await users.goToSettings(this.page);
    await this.page.waitForLoadState('networkidle');
  }

  async openIdeasAccordion(): Promise<void> {
    const accordion = this.page.getByTestId(this.selectors.configAccordionIdea);
    await expect(accordion).toBeVisible({ timeout: this.timeouts.default });
    await accordion.click();
    await this.page.waitForTimeout(this.timeouts.wait);
  }

  async openCategoryForm(): Promise<void> {
    const addButton = this.page.getByTestId(this.selectors.addCategoryButton);
    await expect(addButton).toBeVisible({ timeout: this.timeouts.default });
    await addButton.click();
    await this.page.waitForTimeout(this.timeouts.wait);
  }

  async fillCategoryForm(categoryName: string): Promise<void> {
    const form = this.page.getByTestId(this.selectors.categoryForm);
    await expect(form).toBeVisible({ timeout: this.timeouts.default });

    const nameField = this.page.locator(this.selectors.categoryNameInput);
    await expect(nameField).toBeVisible({ timeout: this.timeouts.default });
    await nameField.fill(categoryName);

    const iconField = this.page.getByTestId(this.selectors.iconField);
    await expect(iconField).toBeVisible({ timeout: this.timeouts.default });
    await iconField.click();
  }

  async submitCategoryForm(): Promise<void> {
    const submitButton = this.page.locator(this.selectors.submitButton);
    await expect(submitButton).toBeVisible({ timeout: this.timeouts.default });
    await submitButton.click();
    await this.page.waitForTimeout(this.timeouts.create);
  }

  private getCategoryChipSelector(categoryName: string): string {
    return `category-chip-${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
  }

  async findCategoryChip(categoryName: string) {
    const chipSelector = this.getCategoryChipSelector(categoryName);
    return this.page.getByTestId(chipSelector);
  }

  async verifyCategoryExists(categoryName: string): Promise<void> {
    const categoryChip = await this.findCategoryChip(categoryName);
    await expect(categoryChip).toBeVisible({ timeout: this.timeouts.default });
  }

  async findDeleteButton(categoryChip: any) {
    return categoryChip.getByTestId(this.selectors.cancelIcon)
      .or(categoryChip.locator('svg[data-testid*="Cancel"]'))
      .or(categoryChip.locator(this.selectors.deleteIcon));
  }

  async deleteCategory(categoryName: string): Promise<void> {
    const categoryChip = await this.findCategoryChip(categoryName);
    const deleteButton = await this.findDeleteButton(categoryChip);
    
    await expect(deleteButton).toBeVisible({ timeout: this.timeouts.default });
    await deleteButton.click();

    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: this.timeouts.default });

    const confirmButton = dialog.getByTestId(this.selectors.deleteConfirmButton);
    await expect(confirmButton).toBeVisible({ timeout: this.timeouts.default });
    await confirmButton.click();

    await expect(categoryChip).not.toBeVisible();
  }

  async createCategory(categoryName: string): Promise<void> {
    await this.navigateToSettings();
    await this.openIdeasAccordion();
    await this.openCategoryForm();
    await this.fillCategoryForm(categoryName);
    await this.submitCategoryForm();
    await this.verifyCategoryExists(categoryName);
  }

  async cleanupCategory(categoryName: string): Promise<void> {
    try {
      await this.navigateToSettings();
      await this.openIdeasAccordion();
      
      const categoryChip = await this.findCategoryChip(categoryName);
      if (await categoryChip.isVisible()) {
        await this.deleteCategory(categoryName);
      }
    } catch (e) {
      // Failed to cleanup category - this is expected in some cases
    }
  }

  async verifyCategoryOnIdea(ideaName: string, categoryName: string): Promise<void> {
    const ideaDiv = this.page.getByTestId(`idea-${ideaName}`).first();
    await expect(ideaDiv).toBeVisible();

    const categoryElement = ideaDiv.getByTestId(`category-${categoryName}`)
      .or(ideaDiv.locator('[data-testid*="category"]').filter({ hasText: categoryName }))
      .or(ideaDiv.locator('.MuiChip-root').filter({ hasText: categoryName }))
      .first();
    
    await expect(categoryElement).toBeVisible();
  }
}

export async function createCategoriesPage(page: Page): Promise<CategoriesPage> {
  return new CategoriesPage(page);
}