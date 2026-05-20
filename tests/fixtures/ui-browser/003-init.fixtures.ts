//import { cleanupAllTestData } from '../../lifecycle/cleanup.old';
import { AulaFixtures, UserFixtures } from '../shared/aula-fixtures.interface';
import { userViaUiFixture } from './002-user.fixture';

/**
 * Configure test with serial mode by default (for mutation tests)
 */
export const initViaUiFixture = userViaUiFixture.extend<AulaFixtures>({
  /**
   * User config - creates/retrieves user data
   * This ensures the user exists in the system before creating their page
   */
  userConfig: async ({ ensureUser }, use) => {
    const user = await ensureUser('user', 20);
    await use(user);
  },

  /**
   * Student config - creates/retrieves student data
   */
  studentConfig: async ({ ensureUser }, use) => {
    const student = await ensureUser('student', 20);
    await use(student);
  },

  init: async ({ ensureUser }, use) => {
    type PickFromK<K extends readonly (keyof UserFixtures)[]> = { [P in K[number]]: UserFixtures[P] };


    const initializationFn = async<K extends readonly (keyof UserFixtures)[]>(include?: K): Promise<{ [P in K[number]]: UserFixtures[P] }> => {
      // @TODO: try without cleaning first, activate for more deterministic solution
      // await cleanupAllTestData(adminPage);

      const response = {} as PickFromK<K>;
      if (!include || include.length === 0) return response;

      // const response: { [P in K[number]]: AulaFixtures[P] } = {} as { [P in K[number]]: AulaFixtures[P] };
      if (include.includes('userConfig')) {
        (response as any)['userConfig'] = await ensureUser('user', 20) as UserFixtures['userConfig'];
        // (response as any)['userConfig' as K[number]] = await ensureUser('user', 20) as AulaFixtures['userConfig'];
      }
      if (include.includes('studentConfig')) {
        (response as any)['studentConfig'] = await ensureUser('student', 20) as UserFixtures['studentConfig'];
        // response.studentConfig = await ensureUser('student', 20);
      }
      return response;
    }
    await use(initializationFn);
  },
});

export { expect } from '@playwright/test';
