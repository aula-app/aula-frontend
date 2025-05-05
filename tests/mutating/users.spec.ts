import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './page_interactions/users';
import * as rooms from './page_interactions/rooms';
import * as ideas from './page_interactions/ideas';
import * as boxes from './page_interactions/boxes';

import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';
import { BoxData } from '../fixtures/ideas';

let room;

let data: { [k: string]: any } = {};

// force these tests to run sqeuentially
test.describe.configure({ mode: 'serial' });

test.describe('Room behaviours - creating rooms', () => {
  test.beforeEach(async () => {
    fixtures.init();
    await browsers.recall();
    room = {
      name: 'room-' + shared.getRunId(),
      description: 'created during automated testing',
      users: [
        //
        fixtures.rainer, //
        fixtures.alice,
        fixtures.bob,
        fixtures.mallory, //
      ],
    };
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  //
  test('Admin can create a room, adding 4 users', async () => {
    await rooms.create(browsers.admin, room);
  });

  // TODO: Burt _should_ be able to make a room
  test('Burt can NOT create a room', async () => {
    await expect(async () => {
      await rooms.create(browsers.burt, room);
    }).rejects.toThrow();
  });

  test('Alice can NOT make a room', async () => {
    // we expect this to fail - alice should _not_ be able to create
    // a room
    await expect(async () => {
      await rooms.create(browsers.alice, room);
    }).rejects.toThrow();
  });

  test('Mallory can NOT make a room', async () => {
    // we expect this to fail - alice should _not_ be able to create
    // a room
    await expect(async () => {
      await rooms.create(browsers.mallory, room);
    }).rejects.toThrow();
  });

  test('Admin can create and remove an Idea', async () => {
    const adminsIdea = {
      name: 'admins-test-idea' + shared.getRunId(),
      description: 'generated during testing data',
    };
    await ideas.create(browsers.admin, room, adminsIdea);
    await ideas.remove(browsers.admin, room, adminsIdea);
  });

  test('Alice can create and delete an Idea', async () => {
    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-3',
      description: 'generated during testing data',
    };
    await ideas.create(browsers.alice, room, alicesIdea);
    await ideas.remove(browsers.alice, room, alicesIdea);
  });

  test('Bob can create an Idea, alice can comment on it, both delete their resources', async () => {
    const bobsIdea = {
      name: 'bobs-test-idea' + shared.getRunId(),
      description: 'generated during testing data',
    };
    await ideas.create(browsers.bob, room, bobsIdea);
    await ideas.comment(browsers.alice, room, bobsIdea, "alice's comment generated in testing");
    await ideas.removeComment(browsers.alice, room, bobsIdea, "alice's comment generated in testing");
    await ideas.remove(browsers.bob, room, bobsIdea);
  });

  test('Bob can not remove alices idea', async () => {
    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-4',
      description: 'generated during testing data',
    };
    await ideas.create(browsers.alice, room, alicesIdea);
    // note we use bobs browser

    await expect(async () => {
      await ideas.remove(browsers.bob, room, alicesIdea);
    }).rejects.toThrow();

    // now alice should remove her own idea
    await ideas.remove(browsers.alice, room, alicesIdea);
  });

  test('Admin can create a box with alice and bobs ideas', async () => {
    const tempScope = shared.gensym();

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

    await ideas.create(browsers.alice, room, alicesIdea);
    await ideas.create(browsers.bob, room, bobsIdea);

    await boxes.create(browsers.admin, room, box);

    await boxes.remove(browsers.admin, room, box);

    await ideas.remove(browsers.alice, room, alicesIdea);
    await ideas.remove(browsers.bob, room, bobsIdea);
  });

  test('Alice cannot create a box', async () => {
    const tempScope = shared.gensym();

    const box: BoxData = {
      name: 'admins-test-box' + shared.getRunId() + '-scope-' + tempScope,
      description: 'generated during automated testing',
      ideas: [],
      discussionDays: 6,
      votingDays: 10,
      phase: 10,
    };

    await expect(async () => {
      await boxes.create(browsers.alice, room, box);
    }).rejects.toThrow();
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

      await ideas.create(browsers.alice, room, data.alicesIdea);
      await ideas.create(browsers.bob, room, data.bobsIdea);

      await boxes.create(browsers.admin, room, data.box);

      await boxes.move(browsers.admin, room, data.box, 10, 20);

      await ideas.approve(browsers.rainer, room, data.box, data.alicesIdea);
      await ideas.approve(browsers.rainer, room, data.box, data.bobsIdea);
    });

    test('rainer can move the box to abstimmung', async () => {
      await boxes.move(browsers.rainer, room, data.box, 20, 30);
    });

    test('users can vote on ideas', async () => {
      await ideas.vote(browsers.alice, room, data.box, data.alicesIdea, 'for');
      await ideas.vote(browsers.alice, room, data.box, data.bobsIdea, 'against');
      await ideas.vote(browsers.bob, room, data.box, data.alicesIdea, 'for');
      await ideas.vote(browsers.bob, room, data.box, data.bobsIdea, 'for');
    });

    test('Rainer can delegate votes to Mallory', async () => {
      await boxes.delegateVotes(browsers.rainer, room, data.box, fixtures.mallory);
    });

    test('Mallory Received those votes', async () => {
      await boxes.hasDelegatedVotes(browsers.mallory, room, data.box);
    });

    test('Rainer can undelegate votes ', async () => {
      await boxes.unDelegateVotes(browsers.rainer, room, data.box);
    });

    test('Mallory can no longer vote for rainer', async () => {
      await expect(async () => {
        await boxes.hasDelegatedVotes(browsers.mallory, room, data.box);
      }).rejects.toThrow();
    });

    test('cleanup', async () => {
      //await boxes.remove(browsers.admin, room, box);
      //await ideas.remove(browsers.alice, room, alicesIdea);
      //await ideas.remove(browsers.bob, room, bobsIdea);
    });
  });

  ////
  ///
  //
});
