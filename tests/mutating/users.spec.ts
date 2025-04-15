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
      name: shared.getRunId(),
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

  //
  test('Admin can create a room, with 4 users', async () => {
    await rooms.create(browsers.admin, room);
  });

  // TODO: Burt _should_ be able to make a room
  test('Burt can create a room, with 4 users', async () => {
    await rooms.create(browsers.burt, room);
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
});
