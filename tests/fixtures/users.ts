import { RoleTypes } from '../../src/types/SettingsTypes.ts';
import { createUser } from '../shared/helpers/entities.ts';
import * as browsers from '../shared/interactions/browsers';
import * as userInteractions from '../shared/interactions/users';
import * as types from './types';
import * as fs from 'fs';
import * as path from 'path';

const BASE_USERS = [
  // { name: 'guest', role: 10 },
  { name: 'user', role: 20 },
  { name: 'student', role: 20 },
  // { name: 'moderator', role: 30 },
  // { name: 'moderator_v', role: 31 },
  // { name: 'super_moderator', role: 40 },
  // { name: 'super_moderator_v', role: 41 },
  // { name: 'principal', role: 44 },
  // { name: 'principal_v', role: 45 },
] as Array<{ name: string; role: RoleTypes }>;

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
  BASE_USERS.forEach((user) => create(user.name, user.role));
};

export const all = () => activeUsers;

export const create = (name: string, role: RoleTypes = 20): types.UserData => {
  // Return existing user if already created
  if (activeUsers[name]) {
    console.log(`User data already exists for: ${name}, reusing existing data`);
    return activeUsers[name];
  }

  console.log(`Creating user data for: ${name} with role ${role}`);
  const newUser = createUser(name, role);
  activeUsers[name] = newUser;
  return newUser;
};

export const get = (name: string): types.UserData | undefined => {
  return name === 'admin' ? admin : activeUsers[name];
};

export const use = async (name: string, role?: RoleTypes): Promise<types.UserData> => {
  console.log(activeUsers);
  let testUserData = get(name);

  // If not in memory, try loading from disk
  if (!testUserData) {
    const loadedData = loadUserData(name);
    if (loadedData) {
      console.log(`♻️  Reusing existing user from disk: ${name}`);
      activeUsers[name] = loadedData;
      testUserData = loadedData;
    }
  }

  // If still not found, create new user
  if (!testUserData) {
    testUserData = create(name, role);
    await userInteractions.start(await browsers.getUserBrowser('admin'), testUserData);
    await browsers.saveState(name);
    saveUserData(name, testUserData);
  }
  return testUserData;
};

export const clear = async (user: types.UserData): Promise<void> => {
  await userInteractions.remove(await browsers.getUserBrowser('admin'), user);

  if (activeUsers[user.username]) {
    delete activeUsers[user.username];
    (await browsers.getUserBrowserContext(user.username)).close();
  }
};

const USER_DATA_DIR = 'tests/temp/user-data';

// Ensure the user data directory exists
const ensureUserDataDir = (): void => {
  if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }
};

// Save user metadata to disk
export const saveUserData = (name: string, userData: types.UserData): void => {
  ensureUserDataDir();
  const filePath = path.join(USER_DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
  console.log(`💾 User data saved for: ${name}`);
};

// Load user metadata from disk
export const loadUserData = (name: string): types.UserData | null => {
  const filePath = path.join(USER_DATA_DIR, `${name}.json`);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const userData = JSON.parse(data) as types.UserData;
    console.log(`📂 User data loaded from disk for: ${name}`);
    return userData;
  }
  return null;
};

// Save all active users to disk
export const saveAllUserData = (): void => {
  ensureUserDataDir();
  Object.entries(activeUsers).forEach(([name, userData]) => {
    saveUserData(name, userData);
  });
  console.log(`💾 All user data saved (${Object.keys(activeUsers).length} users)`);
};
