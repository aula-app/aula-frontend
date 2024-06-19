import { SettingsType } from '@/types/SettingsTypes';
import * as yup from 'yup';

const name = 'Ideas';
const item = 'Idea';
const model = 'Idea';

const rows = [
  {
    id: 8,
    name: 'room_id',
    displayName: 'Room',
  },
  {
    id: 7,
    name: 'content',
    displayName: 'Idea',
  },
  {
    id: 2,
    name: 'created',
    displayName: 'Created',
  },
  {
    id: 3,
    name: 'last_update',
    displayName: 'Last Updated',
  },
];

const forms = [
  {
    type: 'input',
    label: 'Content',
    column: 'content',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    label: 'User ID',
    column: 'user_id',
    required: true,
    hidden: true,
    schema: yup.number().required(),
  },
  {
    type: 'select',
    label: 'Room',
    column: 'room_id',
    fetchOptions: 'rooms',
    required: true,
    hidden: false,
    schema: yup.number().required(),
  },
];

const requests = {
  id: `${model.toLowerCase}_id`,
  fetch: `get${model}s`,
  get: `get${model}BaseData`,
  add: `add${model}`,
  edit: `edit${model}`,
  delete: `delete${model}`,
};

export const ideasSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;