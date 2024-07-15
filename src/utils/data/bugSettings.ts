import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'bugs';
const item = 'bug';
const model = 'Bugs';

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
    type: 'text',
    name: 'description',
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
