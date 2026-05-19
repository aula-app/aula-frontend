import { cleanupAllTestData, cleanupAuthStates } from './cleanup';

export default async function globalTeardown() {
  console.log('🧹 Starting global teardown...');

  try {
    await cleanupAllTestData();
    console.log('✅ Finished global teardown...');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await cleanupAuthStates();
  }
}
