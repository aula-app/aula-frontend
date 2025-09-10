import { expect, test } from '@playwright/test';
import { BoxData } from '../../fixtures/ideas';
import * as fixtures from '../../fixtures/users';
import { describeWithSetup, TestDataBuilder } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import * as boxes from '../../shared/page_interactions/boxes';
import { admin, alice, bob, mallory, rainer } from '../../shared/page_interactions/browsers';
import * as ideas from '../../shared/page_interactions/ideas';
import * as rooms from '../../shared/page_interactions/rooms';
import * as shared from '../../shared/shared';

let room: any;
let data: { [k: string]: any } = {};

describeWithSetup('Room behaviours - creating rooms', () => {
  test.beforeAll(async () => {
    room = TestDataBuilder.createRoom();
  });

  //
  test('Admin can create a room, adding 4 users', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    await rooms.create(admin, room);

    await BrowserHelpers.closePage(admin);
  });

  // TODO: Burt _should_ be able to make a room
  test('Burt can NOT create a room', async () => {
    const burt = await BrowserHelpers.openPageForUser('burt');

    await expect(async () => {
      await rooms.create(burt, room);
    }).rejects.toThrow();

    await burt.close();
  });

  test('Alice can NOT make a room', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    // we expect this to fail - alice should _not_ be able to create
    // a room
    await expect(async () => {
      await rooms.create(alice, room);
    }).rejects.toThrow();

    await BrowserHelpers.closePage(alice);
  });

  test('Mallory can NOT make a room', async () => {
    const mallory = await BrowserHelpers.openPageForUser('mallory');

    // we expect this to fail - alice should _not_ be able to create
    // a room
    await expect(async () => {
      await rooms.create(mallory, room);
    }).rejects.toThrow();

    await BrowserHelpers.closePage(mallory);
  });

  test('Admin can create and remove an Idea', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');

    const adminsIdea = {
      name: 'admins-test-idea' + shared.getRunId(),
      description: 'generated during testing data',
    };
    await ideas.create(admin, room, adminsIdea);
    await ideas.remove(admin, room, adminsIdea);

    await BrowserHelpers.closePage(admin);
  });

  test('Alice can create and delete an Idea', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-3',
      description: 'generated during testing data',
    };
    await ideas.create(alice, room, alicesIdea);
    await ideas.remove(alice, room, alicesIdea);

    await BrowserHelpers.closePage(alice);
  });

  test('Bob can create an Idea, alice can comment on it, both delete their resources', async () => {
    const bob = await BrowserHelpers.openPageForUser('bob');
    const alice = await BrowserHelpers.openPageForUser('alice');

    const bobsIdea = {
      name: 'bobs-test-idea' + shared.getRunId(),
      description: 'generated during testing data',
    };
    await ideas.create(bob, room, bobsIdea);
    await ideas.comment(alice, room, bobsIdea, "alice's comment generated in testing");
    await ideas.removeComment(alice, room, bobsIdea, "alice's comment generated in testing");
    await ideas.remove(bob, room, bobsIdea);

    await BrowserHelpers.closePage(bob);
    await BrowserHelpers.closePage(alice);
  });

  test('Bob can not remove alices idea', async () => {
    const bob = await BrowserHelpers.openPageForUser('bob');
    const alice = await BrowserHelpers.openPageForUser('alice');

    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-4',
      description: 'generated during testing data',
    };
    await ideas.create(alice, room, alicesIdea);
    // note we use bobs browser

    await expect(async () => {
      await ideas.remove(bob, room, alicesIdea);
    }).rejects.toThrow();

    // now alice should remove her own idea
    await ideas.remove(alice, room, alicesIdea);

    await BrowserHelpers.closePage(alice);
    await BrowserHelpers.closePage(bob);
  });

  test('Admin can create a box with alice and bobs ideas', async () => {
    const tempScope = shared.gensym();

    const bob = await BrowserHelpers.openPageForUser('bob');
    const alice = await BrowserHelpers.openPageForUser('alice');
    const admin = await BrowserHelpers.openPageForUser('admin');

    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-' + tempScope,
      description: 'generated during testing data',
    };
    const bobsIdea = {
      name: 'bobs-test-idea' + shared.getRunId() + '-scope-' + tempScope,
      description: 'generated during testing data',
    };

    const box: BoxData = {
      name: 'admins-test-box' + shared.getRunId() + '-scope-' + tempScope,
      description: 'generated during automated testing',
      ideas: [alicesIdea, bobsIdea],
      discussionDays: 6,
      votingDays: 10,
      phase: 10,
    };

    await ideas.create(alice, room, alicesIdea);
    await ideas.create(bob, room, bobsIdea);

    await boxes.create(admin, room, box);

    await boxes.remove(admin, room, box);

    await ideas.remove(alice, room, alicesIdea);
    await ideas.remove(bob, room, bobsIdea);

    await BrowserHelpers.closePage(admin);
    await BrowserHelpers.closePage(alice);
    await BrowserHelpers.closePage(bob);
  });

  test('Alice cannot create a box', async () => {
    const tempScope = shared.gensym();

    const alice = await BrowserHelpers.openPageForUser('alice');

    const box: BoxData = {
      name: 'admins-test-box' + shared.getRunId() + '-scope-' + tempScope,
      description: 'generated during automated testing',
      ideas: [],
      discussionDays: 6,
      votingDays: 10,
      phase: 10,
    };

    await expect(async () => {
      await boxes.create(alice, room, box);
    }).rejects.toThrow();

    await BrowserHelpers.closePage(alice);
  });

  test.describe('full voting workflow', async () => {
    test.beforeAll(async () => {
      data.tempScope = 'fullflow'; // shared.gensym();

      data.alicesIdea = {
        name: 'alices-test-idea' + shared.getRunId() + '-scope-' + data.tempScope,
        description: 'generated during testing data',
      };
      data.bobsIdea = {
        name: 'bobs-test-idea' + shared.getRunId() + '-scope-' + data.tempScope,
        description: 'generated during testing data',
      };

      data.box = {
        name: 'admins-test-box' + shared.getRunId() + '-scope-' + data.tempScope,
        description: 'generated during automated testing',
        ideas: [data.alicesIdea, data.bobsIdea],
        discussionDays: 6,
        votingDays: 10,
        phase: 10,
      };
    });

    test('Rainer can approve ideas in prüfung phase, moving it to abstimmungs phase', async () => {
      test.setTimeout(800000);

      await ideas.create(alice, room, data.alicesIdea);
      await ideas.create(bob, room, data.bobsIdea);

      await boxes.create(admin, room, data.box);

      await boxes.move(admin, room, data.box, 10, 20);

      await ideas.approve(rainer, room, data.box, data.alicesIdea);
      await ideas.approve(rainer, room, data.box, data.bobsIdea);
    });

    test('rainer can move the box to abstimmung', async () => {
      await boxes.move(rainer, room, data.box, 20, 30);
    });

    test('users can vote on ideas', async () => {
      await ideas.vote(alice, room, data.box, data.alicesIdea, 'for');
      await ideas.vote(alice, room, data.box, data.bobsIdea, 'against');
      await ideas.vote(bob, room, data.box, data.alicesIdea, 'for');
      await ideas.vote(bob, room, data.box, data.bobsIdea, 'for');
    });

    test('Rainer can delegate votes to Mallory', async () => {
      await boxes.delegateVotes(rainer, room, data.box, fixtures.mallory);
    });

    test('Mallory Received those votes and can vote with them.', async () => {
      await boxes.hasDelegatedVotes(mallory, room, data.box);

      const beforeCount = await ideas.totalVoteCount(mallory, room, data.box, data.alicesIdea);
      expect(beforeCount).toBe(2);

      await ideas.vote(mallory, room, data.box, data.alicesIdea, 'for');

      const afterCount = await ideas.totalVoteCount(mallory, room, data.box, data.alicesIdea);

      expect(afterCount).toBe(beforeCount + 2);
    });

    test('Rainer can undelegate votes ', async () => {
      await boxes.unDelegateVotes(rainer, room, data.box);
    });

    test('OFF - Mallory can no longer vote for rainer, and vote count was diminished', async () => {
      // test is off until https://github.com/aula-app/aula-frontend/issues/604
      // has been dealt with
      /*   await expect(async () => {
        await boxes.hasDelegatedVotes(mallory, room, data.box);
      }).rejects.toThrow();

      const afterCount = await ideas.totalVoteCount(mallory, room, data.box, data.alicesIdea);

      expect(afterCount).toBe(3); */
      expect(1).toBeDefined();
    });

    test('Rainer can vote against an idea', async () => {
      await ideas.vote(rainer, room, data.box, data.alicesIdea, 'against');
    });

    test('Rainer can move box to results phase', async () => {
      await boxes.move(rainer, room, data.box, 30, 40);
    });

    test('OFF - counts exist, and are as expected', async () => {
      // test is off until https://github.com/aula-app/aula-frontend/issues/604
      // has been dealt with
      /* 
      const [forc, againstc, neutralc] = await ideas.voteCounts(rainer, room, data.box, data.alicesIdea);

      expect(forc).toBe(3);
      expect(againstc).toBe(1);
      expect(neutralc).toBe(0); */
    });

    test('cleanup', async () => {
      //await boxes.remove(admin, room, box);
      //await ideas.remove(alice, room, alicesIdea);
      //await ideas.remove(bob, room, bobsIdea);
    });
  });

  ////
  ///
  //
});
