// called from playwright.config
import * as userData from '../fixtures/users';
import { TestCleanup } from '../shared/cleanup';
import * as browsers from '../shared/interactions/browsers';

export default async function globalTeardown() {
  // Comprehensive cleanup of test artifacts
  console.log('Cleaning up after all tests...');

  await browsers.recall();
  await userData.clearBaseUsers();
  await browsers.shutdown();

  try {
    await TestCleanup.cleanupAll();
    console.info('✅ Test artifacts cleaned up successfully');
  } catch (error) {
    console.warn('⚠️ Some cleanup operations failed:', error);
  }
}
