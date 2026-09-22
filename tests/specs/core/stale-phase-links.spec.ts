import { TEST_IDS } from '../../../src/test-ids';
import { expect, test } from '../../fixtures/aula-tests-fixture';
import * as entities from '../../helpers/entities';
import * as boxes from '../../interactions/boxes';
import * as ideas from '../../interactions/ideas';
import * as navigation from '../../interactions/navigation';
import { BoxData } from '../../support/types';

test('Stale phase links realign with the Box they point at', async ({ seededRoom, newPageFor }) => {
  const PHASES = { DISCUSSION: 10, APPROVAL: 20 } as const;

  const adminPage = await newPageFor('admin');
  const userPage = await newPageFor('user');

  const idea = entities.createIdea('stale-link-idea');
  const box: BoxData = entities.createBox('stale-link-box', seededRoom);
  box.phase = PHASES.DISCUSSION;

  let staleBoxPath = '';
  let staleIdeaPath = '';

  await test.step('User creates an Idea in the Room', async () => {
    await navigation.goToRoom(userPage, seededRoom.name);
    await ideas.create(userPage, idea);
  });

  await test.step('Admin creates a Box and puts the Idea in it', async () => {
    await boxes.create(adminPage, box);
    await boxes.edit(adminPage, { ...box, ideas: [idea] } as BoxData);
  });

  await test.step('Links are captured while the Box is in the Discussion phase', async () => {
    await navigation.goToRoomPhase(adminPage, seededRoom.name, PHASES.DISCUSSION);

    const boxLink = adminPage.getByTestId(`box-${box.name}`);
    await expect(boxLink).toBeVisible();
    staleBoxPath = (await boxLink.getAttribute('href')) ?? '';
    expect(staleBoxPath).toContain(`/phase/${PHASES.DISCUSSION}/idea-box/`);

    await navigation.clickOnPageItem(adminPage, box.name);
    const ideaLink = adminPage.getByTestId(`idea-${idea.name}`).getByRole('link').first();
    await expect(ideaLink).toBeVisible();
    staleIdeaPath = (await ideaLink.getAttribute('href')) ?? '';
    expect(staleIdeaPath).toContain(`/phase/${PHASES.DISCUSSION}/`);
  });

  await test.step('Admin moves the Box to the Approval phase', async () => {
    box.phase = PHASES.APPROVAL;
    await boxes.edit(adminPage, box);
  });

  await test.step('The stale Box link lands on the Box in its new phase', async () => {
    await navigation.ensureUrl(adminPage, staleBoxPath, true);
    await adminPage.waitForURL((url) => url.pathname.includes(`/phase/${PHASES.APPROVAL}/idea-box/`));

    await expect(adminPage.getByTestId(TEST_IDS.BOX_CARD).filter({ hasText: box.name })).toBeVisible();
  });

  await test.step('The stale Idea link realigns onto the Box it is held in', async () => {
    await navigation.ensureUrl(adminPage, staleIdeaPath, true);
    await adminPage.waitForURL((url) => url.pathname.includes(`/phase/${PHASES.APPROVAL}/idea-box/`));

    await expect(adminPage.getByTestId(`idea-${idea.name}`)).toBeVisible();
  });

  await test.step('The realigned Idea page is the one the new phase calls for', async () => {
    // The approval bar only renders in phase 20.
    await expect(adminPage.getByTestId(TEST_IDS.APPROVE_BUTTON)).toBeVisible();
  });
});
