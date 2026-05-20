import { AulaFixtures } from '../shared/aula-fixtures.interface';
import { initViaDbFixture } from './003-init.fixtures';

export const testViaDbFixture = initViaDbFixture.extend<AulaFixtures>({
  initAndUserPage: async ({ init, newPage }, use) => {
    await init();
    return use(await newPage('user', 20));
  },

  initAndAllPages: async ({ init, newPage, adminContext, adminPage }, use) => {
    const { userConfig, studentConfig } = await init(['userConfig', 'studentConfig']);
    const fn = async () => {
      return {
        userConfig,
        studentConfig,
        userPage: await newPage('user', 20),
        studentPage: await newPage('student', 20),
        adminContext: adminContext,
        adminPage: adminPage
      };
    };
    await use(fn);
  },
});
