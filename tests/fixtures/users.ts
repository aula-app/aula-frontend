import * as shared from '../shared/shared.ts';
import * as SettingsTypes from '../../src/types/SettingsTypes.ts';
import fs from 'fs';
import path from 'path';

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

export let alice: UserData;

export let bob: UserData;

export let mallory: UserData;

export let burt: UserData;

export let rainer: UserData;

export const admin: UserData = {
  username: 'admin',
  password: 'aula',
  displayName: 'Admin',
  realName: 'Admin User',
  role: 50,
  about: '',
};

export const init = () => {
  const runId = fs.readFileSync('run-id.txt', 'utf-8');
  console.log('Run ID for fixtures:', runId);

  alice = {
    username: 'alice-user-' + runId,
    password: 'aula',
    displayName: 'alice-' + runId,
    realName: 'Alice Testing' + runId,
    role: 20,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };

  bob = {
    username: 'bob-user-' + runId,
    password: 'aula',
    displayName: 'bob-' + runId,
    realName: 'Bob Testing' + runId,
    role: 20,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };

  mallory = {
    username: 'mallory-moderator_v-' + runId,
    password: 'aula',
    displayName: 'mallory-' + runId,
    realName: 'mallory Testing' + runId,
    role: 41,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };

  burt = {
    username: 'burt-supermoderator_v-' + runId,
    password: 'aula',
    displayName: 'burt-' + runId,
    realName: 'burt Testing' + runId,
    role: 41,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };

  rainer = {
    username: 'rainer-principal_v-' + runId,
    password: 'aula',
    displayName: 'rainer-' + runId,
    realName: 'rainer Testing' + runId,
    role: 45,
    about: 'generated on ' + runId + 'in automated testing framework. should be deleted.',
  };
};
