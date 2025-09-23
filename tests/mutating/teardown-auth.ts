// called from playwright.config
import * as users from '../shared/interactions/users';
import * as userData from '../fixtures/users';
import * as browsers from '../shared/interactions/browsers';
import { TestCleanup } from '../shared/cleanup';

export default async function globalTeardown() {
  await browsers.recall();

  userData.init();

  await users.remove(browsers.admin, userData.alice);
  console.info('deleted alice...', userData.alice.username);
  await users.remove(browsers.admin, userData.bob);
  console.info('deleted bob...', userData.bob.username);
  await users.remove(browsers.admin, userData.mallory);
  console.info('deleted mallory...', userData.mallory.username);
  await users.remove(browsers.admin, userData.burt);
  console.info('deleted...', userData.burt.username);
  await users.remove(browsers.admin, userData.rainer);
  console.info('deleted...', userData.rainer.username);

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
