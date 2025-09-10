// called from playwright.config
import * as users from '../shared/page_interactions/users';
import * as fixtures from '../fixtures/users';
import * as browsers from '../shared/page_interactions/browsers';
import { TestCleanup } from '../shared/cleanup';

export default async function globalTeardown() {
  await browsers.recall();

  fixtures.init();

  await users.remove(browsers.admin, fixtures.alice);
  console.info('deleted alice...', fixtures.alice.username);
  await users.remove(browsers.admin, fixtures.bob);
  console.info('deleted bob...', fixtures.bob.username);
  await users.remove(browsers.admin, fixtures.mallory);
  console.info('deleted mallory...', fixtures.mallory.username);
  await users.remove(browsers.admin, fixtures.burt);
  console.info('deleted...', fixtures.burt.username);
  await users.remove(browsers.admin, fixtures.rainer);
  console.info('deleted...', fixtures.rainer.username);

  // await sleep(5);

  await browsers.shutdown();
  // Comprehensive cleanup of test artifacts
  console.log('Cleaning up after all tests...');
  
  try {
    await TestCleanup.cleanupAll();
    console.log('✅ Test artifacts cleaned up successfully');
  } catch (error) {
    console.warn('⚠️ Some cleanup operations failed:', error);
  }
}
