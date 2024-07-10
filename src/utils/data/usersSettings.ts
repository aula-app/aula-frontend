import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'Users';
const item = 'User';
const model = 'User';

const rows = [
  {
    id: 1,
    name: 'realname',
    displayName: 'Full Name',
  },
  {
    id: 6,
    name: 'displayname',
    displayName: 'User Name',
  },
  {
    id: 5,
    name: 'username',
    displayName: 'login',
  },
  {
    id: 7,
    name: 'email',
    displayName: 'Email',
  },
];

const forms = [
  {
    type: 'input',
    label: 'Display Name',
    column: 'displayname',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    label: 'Student Name',
    column: 'realname',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    label: 'Email',
    column: 'email',
    required: true,
    hidden: false,
    schema: yup.string().email().required(),
  },
  {
    type: 'text',
    label: 'Description',
    column: 'about_me',
    value: 'description?',
    required: false,
    hidden: true,
    schema: yup.string(),
  },
  {
    type: 'input',
    label: 'User Name',
    column: 'username',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    label: 'Password',
    column: 'password',
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
