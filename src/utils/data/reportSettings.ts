import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'Reports';
const item = 'Report';
const model = 'Report';

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
  id: `request_id`,
  fetch: `getRequests`,
  get: `getRequestBaseData`,
  add: `addRequest`,
  edit: `editRequest`,
  delete: `deleteRequest`,
};

export const reportSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;
