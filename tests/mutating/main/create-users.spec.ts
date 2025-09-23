import { expect, test, chromium } from '@playwright/test';
import * as userData from '../../fixtures/users';
import * as browsers from '../../shared/interactions/browsers';
import * as users from '../../shared/interactions/users';

// Configure this test to run in serial mode to ensure proper order
test.describe.configure({ mode: 'serial' });

test.describe('Authentication and User Management', () => {
  // Override the base setup for this specific test since we need fresh browsers
  test.beforeAll(async () => {
    userData.init();
    await browsers.init();
  });

  test.afterEach(async () => {
    await browsers.pickle();
  });
  test('Admin can create multiple users with different permission levels', async () => {
    // Admin login
    await users.login(browsers.admin, userData.admin);

    // Create users and store their temporary passwords
    console.log('creating...', userData.alice.username);
    userData.temporaryPasswords.alice = await users.create(browsers.admin, userData.alice);

    console.log('creating...', userData.bob.username);
    userData.temporaryPasswords.bob = await users.create(browsers.admin, userData.bob);

    console.log('creating...', userData.mallory.username);
    userData.temporaryPasswords.mallory = await users.create(browsers.admin, userData.mallory);

    console.log('creating...', userData.burt.username);
    userData.temporaryPasswords.burt = await users.create(browsers.admin, userData.burt);

    console.log('creating...', userData.rainer.username);
    userData.temporaryPasswords.rainer = await users.create(browsers.admin, userData.rainer);

    // Verify all temporary passwords were created
    expect(userData.temporaryPasswords.alice).toBeTruthy();
    expect(userData.temporaryPasswords.bob).toBeTruthy();
    expect(userData.temporaryPasswords.mallory).toBeTruthy();
    expect(userData.temporaryPasswords.burt).toBeTruthy();
    expect(userData.temporaryPasswords.rainer).toBeTruthy();

    console.log('✅ Users created successfully');
  });

  test('User cannot login with another users temporary password', async () => {
    // Ensure we have the temporary passwords from the previous test
    expect(userData.temporaryPasswords.bob).toBeTruthy();
    expect(userData.temporaryPasswords.mallory).toBeTruthy();

    // mallory should _not_ be able to log in with bob's temporary password.
    await expect(async () => {
      await users.firstLoginFlow(browsers.mallory, userData.mallory, userData.temporaryPasswords.bob);
    }).rejects.toThrow();
  });

  test('All users can complete first login flow with their correct temporary passwords', async () => {
    // Ensure all temporary passwords are available
    expect(userData.temporaryPasswords.alice).toBeTruthy();
    expect(userData.temporaryPasswords.bob).toBeTruthy();
    expect(userData.temporaryPasswords.mallory).toBeTruthy();
    expect(userData.temporaryPasswords.burt).toBeTruthy();
    expect(userData.temporaryPasswords.rainer).toBeTruthy();

    // All first login flows should work with correct passwords using existing browser contexts
    await Promise.all([
      users.firstLoginFlow(browsers.alice, userData.alice, userData.temporaryPasswords.alice),
      users.firstLoginFlow(browsers.bob, userData.bob, userData.temporaryPasswords.bob),
      users.firstLoginFlow(browsers.mallory, userData.mallory, userData.temporaryPasswords.mallory),
      users.firstLoginFlow(browsers.burt, userData.burt, userData.temporaryPasswords.burt),
      users.firstLoginFlow(browsers.rainer, userData.rainer, userData.temporaryPasswords.rainer),
    ]);
  });

  test('Users can login with their new passwords after first login flow', async () => {
    // First logout all users to ensure clean state
    await Promise.all([
      users.logout(browsers.alice),
      users.logout(browsers.bob),
      users.logout(browsers.mallory),
      users.logout(browsers.burt),
      users.logout(browsers.rainer),
    ]);

    // Test that users can now login with their permanent passwords
    await Promise.all([
      users.login(browsers.alice, userData.alice),
      users.login(browsers.bob, userData.bob),
      users.login(browsers.mallory, userData.mallory),
      users.login(browsers.burt, userData.burt),
      users.login(browsers.rainer, userData.rainer),
    ]);
  });

  test('Save authentication states for other tests', async () => {
    // Save authentication states so other tests can use them
    console.log('Saving authentication states...');

    await Promise.all([
      browsers.alice.context().storageState({
        path: 'tests/auth-states/alice.json',
      }),
      browsers.bob.context().storageState({
        path: 'tests/auth-states/bob.json',
      }),
      browsers.mallory.context().storageState({
        path: 'tests/auth-states/mallory.json',
      }),
      browsers.burt.context().storageState({
        path: 'tests/auth-states/burt.json',
      }),
      browsers.rainer.context().storageState({
        path: 'tests/auth-states/rainer.json',
      }),
      browsers.admin.context().storageState({
        path: 'tests/auth-states/admin.json',
      }),
    ]);

    console.log('✅ Authentication states saved successfully');
  });
});
