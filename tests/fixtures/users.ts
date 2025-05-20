import * as shared from '../shared';
import * as SettingsTypes from '../../src/types/SettingsTypes.ts';

/*
 * 10 => "guest",
 * 20 => "user",
 * 30 => "moderator",
 * 31 => "moderator_v",
 * 40 => "super_moderator",
 * 41 => "super_moderator_v",
 * 44 => "principal",
 * 45 => "principal_v",
 * 50 => "admin",
 * 60 => "tech_admin"
 */
export type UserData = {
  username: string;
  password: string;
  displayName: string;
  realName: string;
  role: SettingsTypes.RoleTypes;
  about: string;
};

export const alice: UserData = {
  username: 'alice-user-' + shared.timestamp,
  password: 'aula',
  displayName: 'alice-' + shared.timestamp,
  realName: 'Alice Testing',
  role: 20,
  about: 'generated on ' + shared.timestring + 'in automated testing framework. should be deleted.',
};
export const bob: UserData = {
  username: 'bob-user-' + shared.timestamp,
  password: 'aula',
  displayName: 'bob-' + shared.timestamp,
  realName: 'Bob Testing',
  role: 20,
  about: 'generated on ' + shared.timestring + 'in automated testing framework. should be deleted.',
};

export const mallory: UserData = {
  username: 'mallory-moderator_v-' + shared.timestamp,
  password: 'aula',
  displayName: 'mallory-' + shared.timestamp,
  realName: 'mallory Testing',
  role: 31,
  about: 'generated on ' + shared.timestring + 'in automated testing framework. should be deleted.',
};

export const burt: UserData = {
  username: 'burt-supermoderator_v-' + shared.timestamp,
  password: 'aula',
  displayName: 'burt-' + shared.timestamp,
  realName: 'burt Testing',
  role: 41,
  about: 'generated on ' + shared.timestring + 'in automated testing framework. should be deleted.',
};

export const rainer: UserData = {
  username: 'rainer-principal_v-' + shared.timestamp,
  password: 'aula',
  displayName: 'rainer-' + shared.timestamp,
  realName: 'rainer Testing',
  role: 45,
  about: 'generated on ' + shared.timestring + 'in automated testing framework. should be deleted.',
};

export const admin: UserData = {
  username: 'admin',
  password: 'aula',
  displayName: 'Admin',
  realName: 'Admin User',
  role: 50,
  about: '',
};
