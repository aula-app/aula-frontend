import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';

/**
 * Ideas Search and Sort Tests (Room page)
 * Tests the ScopeTitle search/sort controls on the room Ideas view:
 * toggling the panel, filtering by title and content, the no-results state,
 * sorting by title and reversing the direction.
 *
 * Seeds its own room (fixture), so idea counts are deterministic.
 */
test('Ideas Search and Sort (Room page)', async ({ seededRoom, newPageFor }) => {
  const userPage = await newPageFor('user');

  // All three names share the same gensym hash and differ only in the final
  // letter, so the title sort order (a < b < c) is deterministic.
  const ideaA = entities.createIdea('sort-a');
  const ideaB = { ...ideaA, name: ideaA.name.replace(/-a$/, '-b'), description: 'content with zebra keyword' };
  const ideaC = { ...ideaA, name: ideaA.name.replace(/-a$/, '-c') };

  const Heading = userPage.locator('h1');
  const SearchToggle = userPage.getByTestId(TEST_IDS.SEARCH_BUTTON);
  const ScopeControls = userPage.getByTestId(TEST_IDS.SCOPE_CONTROLS);
  const SearchField = userPage.getByTestId(TEST_IDS.SEARCH_FIELD);
  const SortSelect = userPage.getByTestId(TEST_IDS.SORT_SELECT);
  const SortDirection = userPage.getByTestId(TEST_IDS.SORT_DIRECTION_BUTTON);
  const IdeaCards = userPage.locator('[data-testid^="idea-test-idea-"]');
  const NoResultsState = userPage.getByTestId('ideas-no-results-state');

  const expectOrder = async (names: string[]) => {
    await expect(IdeaCards).toHaveCount(names.length);
    for (const [i, name] of names.entries()) {
      await expect(IdeaCards.nth(i)).toHaveAttribute('data-testid', `idea-${name}`);
    }
  };

  await test.step('User - Create three Ideas to search and sort', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, ideaA);
    await ideas.create(userPage, ideaB);
    await ideas.create(userPage, ideaC);
    await expect(IdeaCards).toHaveCount(3);
  });

  await test.step('Toggle opens the controls and focuses the search field', async () => {
    // the closed panel is clipped + inert, not hidden — assert inert instead of visibility
    await expect(SearchToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(ScopeControls).toHaveAttribute('inert', '');

    await SearchToggle.click();

    await expect(SearchToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(ScopeControls).not.toHaveAttribute('inert');
    await expect(SearchField).toBeFocused();
  });

  await test.step('Search filters by title and the heading count follows', async () => {
    await SearchField.fill(ideaB.name);

    await expectOrder([ideaB.name]);
    await expect(Heading).toContainText('1');

    await SearchField.fill('');
    await expect(IdeaCards).toHaveCount(3);
    await expect(Heading).toContainText('3');
  });

  await test.step('Search matches the idea content', async () => {
    await SearchField.fill('zebra');
    await expectOrder([ideaB.name]);
  });

  await test.step('No matches shows the no-results state, not the empty state', async () => {
    await SearchField.fill('xyznonexistentidea123456789');

    await expect(NoResultsState).toBeVisible();
    await expect(IdeaCards).toHaveCount(0);
    await expect(Heading).toContainText('0');
    await expect(userPage.getByTestId('ideas-empty-state')).toHaveCount(0);
  });

  await test.step('Closing the controls clears the search', async () => {
    await SearchToggle.click();

    await expect(SearchToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(IdeaCards).toHaveCount(3);

    await SearchToggle.click();
    await expect(SearchField).toHaveValue('');
  });

  await test.step('Sort by title orders the ideas alphabetically', async () => {
    await SortSelect.click();
    await userPage.getByTestId('sort-select-option-title').click();

    await expectOrder([ideaA.name, ideaB.name, ideaC.name]);
  });

  await test.step('Direction button reverses the order', async () => {
    await expect(SortDirection).toHaveAttribute('aria-pressed', 'false');

    await SortDirection.click();

    await expect(SortDirection).toHaveAttribute('aria-pressed', 'true');
    await expectOrder([ideaC.name, ideaB.name, ideaA.name]);

    await SortDirection.click();
    await expect(SortDirection).toHaveAttribute('aria-pressed', 'false');
    await expectOrder([ideaA.name, ideaB.name, ideaC.name]);
  });

  await test.step('Search and sort apply together', async () => {
    // common prefix of all three names — everything but the trailing letter
    await SearchField.fill(ideaA.name.slice(0, -1));
    await expectOrder([ideaA.name, ideaB.name, ideaC.name]);

    await SortDirection.click();

    await expect(SearchField).toHaveValue(ideaA.name.slice(0, -1));
    await expectOrder([ideaC.name, ideaB.name, ideaA.name]);
  });

  await test.step('Selected sort option is marked in the listbox', async () => {
    await SortSelect.click();

    await expect(userPage.getByTestId('sort-select-option-title')).toHaveAttribute('aria-selected', 'true');
    await expect(userPage.getByTestId('sort-select-option-created')).toHaveAttribute('aria-selected', 'false');

    // Escape closes the listbox
    await userPage.keyboard.press('Escape');
    await expect(SortSelect).toHaveAttribute('aria-expanded', 'false');
  });
});
