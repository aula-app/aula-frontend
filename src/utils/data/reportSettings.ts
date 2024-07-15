import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'reports';
const item = 'report';
const model = 'Report';

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
