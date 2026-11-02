import { Page } from '@playwright/test';
import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import * as shared from '../../support/utils';
import { BoxData } from '../../support/types';

/**
 * Dashboard and Phase view Tests
 * The Home dashboard counts the current user's Ideas per phase and links to
 * /phase/:phase, which lists those Ideas across all of the user's rooms.
 */

const phaseLink = (page: Page, phase: number) => page.getByTestId(`dashboard-phase-${phase}`);

/** PhaseCountLink carries the count only in its accessible name once loaded: "<phase> - <n> <noun>". */
const expectPhaseCount = (page: Page, phase: number, count: number) =>
  expect(phaseLink(page, phase)).toHaveAttribute('aria-label', new RegExp(` - ${count} `));

test('Dashboard counts own Ideas per phase and links to them', async ({ seededRoom, newPageFor }) => {
  const userPage = await newPageFor('user');
  const studentPage = await newPageFor('student');

  const ownIdea = entities.createIdea('dashboard-own');
  const othersIdea = entities.createIdea('dashboard-other');

  const Toggle = userPage.getByTestId('dashboard-toggle');
  const PhaseIdeas = userPage.getByTestId('phase-idea-item');

  await test.step('Home shows the dashboard with a link per phase', async () => {
    await navigation.goToHome(userPage);

    await expect(Toggle).toHaveAttribute('aria-expanded', 'true');
    for (const phase of [0, 10, 20, 30]) {
      await expect(phaseLink(userPage, phase)).toHaveAttribute('href', `/phase/${phase}`);
    }
    await expectPhaseCount(userPage, 0, 0);
  });

  await test.step('User and Student each add a wild Idea', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, ownIdea);

    await navigation.goToRoom(studentPage, seededRoom.name);
    await ideas.create(studentPage, othersIdea);
  });

  await test.step("The wild count includes only the User's own Idea", async () => {
    await navigation.goToHome(userPage);
    await expectPhaseCount(userPage, 0, 1);
  });

  await test.step('The phase link lists the own Idea and not the other one', async () => {
    await phaseLink(userPage, 0).click();
    await userPage.waitForURL((url) => url.pathname === '/phase/0');

    await expect(PhaseIdeas).toHaveCount(1);
    await expect(userPage.getByTestId(`idea-${ownIdea.name}`)).toBeVisible();
    await expect(userPage.getByTestId(`idea-${othersIdea.name}`)).toHaveCount(0);
  });

  await test.step('Search with no match shows the no-results state', async () => {
    await userPage.getByTestId(TEST_IDS.SEARCH_BUTTON).click();
    await userPage.getByTestId(TEST_IDS.SEARCH_FIELD).fill('xyznonexistentidea123456789');

    await expect(userPage.getByTestId('phase-ideas-no-results-state')).toBeVisible();
    await expect(PhaseIdeas).toHaveCount(0);

    await userPage.getByTestId(TEST_IDS.SEARCH_FIELD).fill(ownIdea.name);
    await expect(PhaseIdeas).toHaveCount(1);
  });

  await test.step('The dashboard toggle collapses the phase links', async () => {
    const Panel = userPage.locator(`[id="${await Toggle.getAttribute('aria-controls')}"]`);

    await Toggle.click();
    await expect(Toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(Panel).toHaveAttribute('inert', '');

    await Toggle.click();
    await expect(Toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(Panel).not.toHaveAttribute('inert');
  });
});

test('Phase view follows an Idea into its Box phase', async ({ seededRoom, newPageFor }) => {
  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  const idea = entities.createIdea('phase-view');
  const box: BoxData = entities.createBox('phase-view-box', seededRoom);

  await test.step('User adds an Idea; Admin puts it in a Box in discussion', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, idea);

    await boxes.create(adminPage, box);
    await boxes.edit(adminPage, { ...box, ideas: [idea] } as BoxData);
  });

  await test.step('The dashboard counts it under discussion, no longer as wild', async () => {
    await navigation.goToHome(userPage);

    await expectPhaseCount(userPage, 10, 1);
    await expectPhaseCount(userPage, 0, 0);
  });

  await test.step('The discussion phase view lists it', async () => {
    await phaseLink(userPage, 10).click();
    await userPage.waitForURL((url) => url.pathname === '/phase/10');

    await expect(userPage.getByTestId(`idea-${idea.name}`)).toBeVisible();
  });

  await test.step('The wild phase view is empty', async () => {
    await userPage.goto(`${shared.getHost()}/phase/0`);
    await expect(userPage.getByTestId('phase-ideas-empty-state')).toBeVisible();
  });
});

test('Unknown phase redirects to not found', async ({ newPageFor }) => {
  const userPage = await newPageFor('user');

  await userPage.goto(`${shared.getHost()}/phase/7`);
  await expect(userPage.getByTestId('not-found-view')).toBeVisible();
});
