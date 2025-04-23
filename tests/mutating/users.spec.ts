import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './page_interactions/users';
import * as rooms from './page_interactions/rooms';
import * as ideas from './page_interactions/ideas';
import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';

let room;

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

  ////
  ///
  //
});
