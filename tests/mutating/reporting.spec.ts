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

import { ReportOptions } from '../../src/components/DataForms/ReportForms';

let room;

let data: { [k: string]: any } = {};

// force these tests to run sqeuentially
test.describe.configure({ mode: 'serial' });

test.describe('Reporting flow', () => {
  test.beforeAll(async () => {
    fixtures.init();

    room = {
      name: 'room-' + shared.getRunId() + '-reporting',
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
  test.beforeEach(async () => {
    await browsers.recall();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });

  //
  test('Admin can create a room, adding 4 users', async () => {
    await rooms.create(browsers.admin, room);
  });

  test('Alice creates an idea', async () => {
    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-3',
      description: 'generated during testing data',
    };
    await ideas.create(browsers.alice, room, alicesIdea);
  });

  test('Bob reports that idea', async () => {
    const bob = await browsers.newPage(browsers.bobs_browser);
    const admin = await browsers.newPage(browsers.admins_browser);

    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-3',
      description: 'generated during testing data',
    };

    await ideas.report(bob, room, alicesIdea, 'misinformation');

    await ideas.checkReport(admin, alicesIdea);
    await bob.close();
    await admin.close();
  });

  test('Bob Comments on Alices Idea', async () => {
    const bob = await browsers.newPage(browsers.bobs_browser);

    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-3',
      description: 'generated during testing data',
    };

    await ideas.comment(bob, room, alicesIdea, 'You posted misinformation!');

    await bob.close();
  });

  test('Alice reports bobs comment', async () => {
    const alice = await browsers.newPage(browsers.alices_browser);
    const admin = await browsers.newPage(browsers.admins_browser);

    const alicesIdea = {
      name: 'alices-test-idea' + shared.getRunId() + '-scope-3',
      description: 'generated during testing data',
    };

    await ideas.reportComment(alice, room, alicesIdea, 'You posted misinformation!', 'misinformation');

    await ideas.checkCommentReport(admin, 'You posted misinformation!');

    await alice.close();
    await admin.close();
  });
});
