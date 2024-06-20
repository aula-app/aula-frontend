import { SettingsType } from '@/types/SettingsTypes';
import * as yup from 'yup';

const name = 'Boxes';
const item = 'Box';
const model = 'Topic';

const rows = [
  {
    id: 1,
    name: 'name',
    displayName: 'Name',
  },
  {
    id: 5,
    name: 'description_public',
    displayName: 'Description',
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
    label: 'Name',
    column: 'name',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'text',
    label: 'Description',
    column: 'description_public',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'text',
    label: 'Internal Description',
    column: 'description_internal',
    value: 'Internal description?',
    required: false,
    hidden: true,
    schema: yup.string(),
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

export const boxesSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;
