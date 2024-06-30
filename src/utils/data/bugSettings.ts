import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'Bugs';
const item = 'Bug';
const model = 'Bugs';

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
    type: 'text',
    label: 'Description',
    column: 'description',
    required: true,
    hidden: false,
    schema: yup.string(),
  },
];

const requests = {
  id: `bug_id`,
  fetch: `getBugs`,
  get: `getBugBaseData`,
  add: `addBug`,
  edit: `editBug`,
  delete: `deleteBug`,
};

export const bugSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;
