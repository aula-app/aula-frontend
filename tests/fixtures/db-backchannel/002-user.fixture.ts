import { RoleTypes } from '../../../src/types/SettingsTypes';
import { createRoom, createUserData } from '../../helpers/entities';
import { cleanupAuthStates } from '../../lifecycle/db-backchannel/cleanup';
import { RoomData, UserData } from '../../support/types';
import { adminContextFixture } from '../shared/000-admin.worker-fixture';
import { UserFixtures } from '../shared/aula-fixtures.interface';
import { DbBackchannel } from './db-backchannel';

export const userViaDbFixture = adminContextFixture.extend<UserFixtures & { dbReset: () => Promise<void> }>({
  dbReset: async ({ }, use) => {
    const dbBackchannel = await DbBackchannel.getByInstanceCode();
    const run = async () => {
      await dbBackchannel.truncateAll();
      await dbBackchannel.seed();
      await cleanupAuthStates({ keepAdminContext: true });
    };
    await use(run);
  },

  ensureUser: async ({ }, use) => {
    const userCache: { [name: string]: UserData } = {};

    const factory = async (name: string, role: RoleTypes = 20): Promise<UserData> => {
      if (userCache[name]) {
        console.log(` Found user ${name} in userCache: ${userCache[name].username}`);
        return userCache[name];
      }

      console.log(`📝 Building user: "${name}" with role ${role}`);
      // @TODO: refactor to use deterministic data
      const userData = createUserData(name, role);
      userData.password = 'aula';

      try {
        const dbBackchannel = await DbBackchannel.getByInstanceCode();
        await dbBackchannel.insertUser(userData);
        console.log(`✅ User "${name}" created via DB backchannel`);
        userCache[name] = userData;
      } catch (error) {
        console.error(`❌ Failed to create user "${name}":`, error);
        throw error;
      }

      return userData;
    };

    await use(factory);
  },

  ensureRoom: async ({ }, use) => {
    const roomCache: { [name: string]: RoomData } = {};

    const factory = async (name: string, users: { username: string }[]): Promise<RoomData> => {
      if (roomCache[name]) {
        console.log(` Found room ${name} in roomCache: ${JSON.stringify(roomCache[name])}`);
        return roomCache[name];
      }

      console.log(`📝 Building room: "${name}" with users ${JSON.stringify(users)}`);
      // @TODO: refactor to use deterministic data
      const roomData = createRoom(name, users);

      try {
        const dbBackchannel = await DbBackchannel.getByInstanceCode();
        await dbBackchannel.insertRoom(roomData);
        console.log(`✅ Room "${name}" created via DB backchannel`);
        roomCache[name] = roomData;
      } catch (error) {
        console.error(`❌ Failed to create room "${name}":`, error);
        throw error;
      }

      return roomData;
    }

    return use(factory);
  }
});

export { expect } from '@playwright/test';
