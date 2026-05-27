import { cleanupTestData } from './cleanup';

export default async function globalTeardown() {
  console.log('🧹 Cleaning up auth states...');

  await cleanupTestData();
}
