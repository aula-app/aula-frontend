import { cleanupAuthStates } from './cleanup';

export default async function globalTeardown() {
  console.log('🧹 Cleaning up auth states...');

  await cleanupAuthStates();
}
