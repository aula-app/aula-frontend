import { RoleTypes } from '../../src/types/SettingsTypes.ts';
import { createUserData } from '../shared/helpers/entities.ts';
import * as browsers from '../shared/interactions/browsers';
import { start } from '../shared/interactions/users';
import * as types from './types';

const activeUsers: Record<string, types.UserData> = {};

export const admin: types.UserData = {
  username: 'admin',
  password: 'aula',
  displayName: 'Admin',
  realName: 'Admin User',
  role: 50,
  about: '',
};

export const init = () => {
  create('user');
  create('other-user');
};

export const all = () => activeUsers;

export const create = (name: string, role: RoleTypes = 20): types.UserData => {
  console.log(`Creating user data for: ${name} with role ${role}`);
  const neuUser = createUserData(name, role);
  activeUsers[name] = neuUser;
  return neuUser;
};

export const get = (name: string): types.UserData | undefined => {
  return name === 'admin' ? admin : activeUsers[name];
};

export const use = async (name: string, role?: RoleTypes): Promise<types.UserData> => {
  let testUserData = get(name);
  if (!testUserData) {
    testUserData = create(name, role);
    await start(await browsers.getUserBrowser('admin'), testUserData);
    await browsers.saveState(testUserData.username);
  }
  return testUserData;
};
