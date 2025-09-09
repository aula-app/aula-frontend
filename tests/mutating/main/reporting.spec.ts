import { test, expect } from '@playwright/test';
import { describeWithSetup, TestDataBuilder } from '../../shared/base-test';
import { BrowserHelpers } from '../../shared/common-actions';
import * as shared from '../../shared/shared';
import * as rooms from '../../shared/page_interactions/rooms';
import * as ideas from '../../shared/page_interactions/ideas';
import * as ui from '../../shared/page_interactions/interface';

describeWithSetup('Reporting flow', () => {
  let room: any;
  let data: { [k: string]: any } = {};

  test.beforeAll(async () => {
    room = TestDataBuilder.createRoom('reporting');
  });

  //
  test('Admin can create a room, adding 4 users', async () => {
    const admin = await BrowserHelpers.openPageForUser('admin');
    await rooms.create(admin, room);
    await BrowserHelpers.closePage(admin);
  });

  test('Alice creates an idea', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');

    data.alicesIdea = TestDataBuilder.createIdea('reporting-scope-3');
    await ideas.create(alice, room, data.alicesIdea);
  });

  test('Bob reports that idea', async () => {
    const bob = await BrowserHelpers.openPageForUser('bob');
    const admin = await BrowserHelpers.openPageForUser('admin');

    expect(data.alicesIdea).toBeDefined();

    await ideas.report(bob, room, data.alicesIdea, 'misinformation');

    await ideas.checkReport(admin, data.alicesIdea);
    await BrowserHelpers.closePage(bob);
    await BrowserHelpers.closePage(admin);
  });

  test('Bob Comments on Alices Idea', async () => {
    const bob = await BrowserHelpers.openPageForUser('bob');

    data.bobsComment = 'You posted misinformation' + shared.gensym();

    await ideas.comment(bob, room, data.alicesIdea, data.bobsComment);

    await BrowserHelpers.closePage(bob);
  });

  test('Alice reports bobs comment', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');
    const admin = await BrowserHelpers.openPageForUser('admin');

    await ideas.reportComment(alice, room, data.alicesIdea, data.bobsComment, 'misinformation');

    await ideas.checkCommentReport(admin, data.bobsComment);

    await BrowserHelpers.closePage(alice);
    await BrowserHelpers.closePage(admin);
  });

  test('Alice reports a bug', async () => {
    const alice = await BrowserHelpers.openPageForUser('alice');
    const admin = await BrowserHelpers.openPageForUser('admin');

    data.bugreport = 'This does not work' + shared.gensym();

    await ui.reportBug(alice, data.bugreport);

    await ui.checkReport(admin, data.bugreport);

    await BrowserHelpers.closePage(alice);
    await BrowserHelpers.closePage(admin);
  });
});
