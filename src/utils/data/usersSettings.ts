import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'users';
const item = 'user';
const model = 'User';

const rows = [
  {
    id: 1,
    name: 'realname',
  },
  {
    id: 6,
    name: 'displayname',
  },
  {
    id: 5,
    name: 'username',
  },
  {
    id: 7,
    name: 'email',
  },
];

const forms = [
  {
    type: 'input',
    name: 'displayname',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    name: 'realname',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    name: 'email',
    required: true,
    hidden: false,
    schema: yup.string().email().required(),
  },
  {
    type: 'text',
    name: 'about_me',
    value: 'description?',
    required: false,
    hidden: true,
    schema: yup.string(),
  },
  {
    type: 'input',
    name: 'username',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    name: 'password',
    value: 'default_password',
    required: true,
    hidden: true,
    schema: yup.string().required(),
  },
];

const requests = {
  id: `user_id`,
  fetch: `getUsers`,
  get: `getUserBaseData`,
  add: `addUser`,
  edit: `editUser`,
  delete: `deleteUser`,
};

export const usersSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;
