import { test, expect, BrowserContext, Page, chromium, Browser } from '@playwright/test';
import { sleep } from '../utils';
import * as shared from '../shared';
import * as users from './page_interactions/users';
import * as rooms from './page_interactions/rooms';
import * as ideas from './page_interactions/ideas';
import * as fixtures from '../fixtures/users';
import * as browsers from './browsers';

let room;

test.describe('Room behaviours - creating rooms', () => {
  test.beforeAll(async () => {
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

  /*   test('Admin can create a supermoderator', async () => {
    await users.create(browsers.admin, {
      username: 'burt-supermoderator_v-' + Date.now().toString(),
      password: 'aula',
      displayName: 'burt-',
      realName: 'burt Testing',
      role: 41,
      about: 'generated on ' + 'in automated testing framework. should be deleted.',
    });
  }); */

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

  test('Admin can create an Idea', async () => {
    const adminsIdea = {
      name: 'admins-test-idea' + shared.getRunId(),
      description: 'generated during testing data',
    };
    await ideas.create(browsers.admin, room, adminsIdea);
  });

  test('Alice can create an Idea', async () => {
    const alices = {
      name: 'alices-test-idea' + shared.getRunId(),
      description: 'generated during testing data',
    };
    await ideas.create(browsers.alice, room, alices);
  });

  test('Bob can create an Idea', async () => {
    const bobs = {
      name: 'bobs-test-idea' + shared.getRunId(),
      description: 'generated during testing data',
    };
    await ideas.create(browsers.bob, room, bobs);
  });

  test('Alice can comment on bobs idea', async () => {
    const bobs = {
      name: 'bobs-test-idea' + shared.getRunId(),
      description: 'generated during testing data',
    };
    await ideas.comment(browsers.alice, room, bobs);
  });

  ////
  ///
  //
});
