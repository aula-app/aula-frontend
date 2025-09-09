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
      categoryNameInput: 'category-name-field',
      iconFieldContainer: 'icon-field-container',
      iconFieldButtons: 'icon-field-buttons',
      iconField: 'icon-field-1',
      submitButton: 'category-form-submit-button',
      deleteDialog: 'delete-category-dialog',
      deleteConfirmButton: 'delete-cat-button',
      cancelButton: 'category-form-cancel-button',
      categoriesContainer: 'categories-container',
      chipsContainer: 'categories-chips-container',
      formDrawer: 'category-form-drawer',
      cancelIcon: 'CancelIcon',
      deleteIcon: '.MuiChip-deleteIcon',
    };
  }

  private get timeouts() {
    return {
      default: 10000,
      short: 5000,
      wait: 1000,
      create: 2000,
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

  async fillCategoryForm(categoryName: string, iconIndex: number = 1): Promise<void> {
    const form = this.page.getByTestId(this.selectors.categoryForm);
    await expect(form).toBeVisible({ timeout: this.timeouts.default });

    const nameField = this.page.getByTestId(this.selectors.categoryNameInput);
    await expect(nameField).toBeVisible({ timeout: this.timeouts.default });
    await nameField.fill(categoryName);

    // Use more specific icon selection
    const iconFieldContainer = this.page.getByTestId(this.selectors.iconFieldContainer);
    await expect(iconFieldContainer).toBeVisible({ timeout: this.timeouts.default });

    const iconButton = this.page.getByTestId(`icon-field-${iconIndex}`);
    await expect(iconButton).toBeVisible({ timeout: this.timeouts.default });
    await iconButton.click();
  }

  async submitCategoryForm(): Promise<void> {
    const submitButton = this.page.getByTestId(this.selectors.submitButton);
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
    return categoryChip
      .getByTestId(this.selectors.cancelIcon)
      .or(categoryChip.locator('svg[data-testid*="Cancel"]'))
      .or(categoryChip.locator(this.selectors.deleteIcon));
  }

  async deleteCategory(categoryName: string): Promise<void> {
    const categoryChip = await this.findCategoryChip(categoryName);
    const deleteButton = await this.findDeleteButton(categoryChip);

    await expect(deleteButton).toBeVisible({ timeout: this.timeouts.default });
    await deleteButton.click();

    const dialog = this.page.getByTestId(this.selectors.deleteDialog);
    await expect(dialog).toBeVisible({ timeout: this.timeouts.default });

    const confirmButton = this.page.getByTestId(this.selectors.deleteConfirmButton);
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
    // Use more specific selector to target the exact idea
    const ideaDiv = this.page.getByTestId(`idea-${ideaName}`);
    await expect(ideaDiv).toBeVisible();

    // Look for category chip within the specific idea using multiple fallback strategies
    const categoryElement = ideaDiv
      .getByTestId(`category-${categoryName}`)
      .or(ideaDiv.locator(`[data-category-name="${categoryName}"]`))
      .or(ideaDiv.locator('[data-testid*="category"]').filter({ hasText: categoryName }))
      .or(ideaDiv.locator('.MuiChip-root').filter({ hasText: categoryName }));

    await expect(categoryElement.first()).toBeVisible();
  }

  /**
   * Verifies that the categories container is visible
   */
  async verifyCategoriesContainer(): Promise<void> {
    const container = this.page.getByTestId(this.selectors.categoriesContainer);
    await expect(container).toBeVisible({ timeout: this.timeouts.default });
  }

  /**
   * Waits for the form drawer to be visible
   */
  async waitForFormDrawer(): Promise<void> {
    const drawer = this.page.getByTestId(this.selectors.formDrawer);
    await expect(drawer).toBeVisible({ timeout: this.timeouts.default });
  }

  /**
   * Waits for the form drawer to be hidden
   */
  async waitForFormDrawerToClose(): Promise<void> {
    const drawer = this.page.getByTestId(this.selectors.formDrawer);
    await expect(drawer).not.toBeVisible({ timeout: this.timeouts.default });
  }

  /**
   * Cancels the category form
   */
  async cancelCategoryForm(): Promise<void> {
    const cancelButton = this.page.getByTestId(this.selectors.cancelButton);
    await expect(cancelButton).toBeVisible({ timeout: this.timeouts.default });
    await cancelButton.click();
  }

  /**
   * Gets a category chip by its ID (more reliable than name-based)
   */
  async findCategoryChipById(categoryId: string) {
    return this.page.locator(`[data-category-id="${categoryId}"]`);
  }

  /**
   * Verifies that a specific number of category chips are visible
   */
  async verifyCategoryCount(expectedCount: number): Promise<void> {
    const chips = this.page.getByTestId(this.selectors.chipsContainer).locator('[data-testid^="category-chip-"]');
    await expect(chips).toHaveCount(expectedCount);
  }

  /**
   * Selects an icon by its name (more reliable than index)
   */
  async selectIconByName(iconName: string): Promise<void> {
    const iconButton = this.page.locator(`[data-testid^="icon-field-"][data-icon-name="${iconName}"]`);
    await expect(iconButton).toBeVisible({ timeout: this.timeouts.default });
    await iconButton.click();
  }

  /**
   * Fills category form with icon selection by name
   */
  async fillCategoryFormWithIcon(categoryName: string, iconName: string): Promise<void> {
    const form = this.page.getByTestId(this.selectors.categoryForm);
    await expect(form).toBeVisible({ timeout: this.timeouts.default });

    const nameField = this.page.getByTestId(this.selectors.categoryNameInput);
    await expect(nameField).toBeVisible({ timeout: this.timeouts.default });
    await nameField.fill(categoryName);

    await this.selectIconByName(iconName);
  }
}

export async function createCategoriesPage(page: Page): Promise<CategoriesPage> {
  return new CategoriesPage(page);
}
