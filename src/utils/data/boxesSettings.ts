import { SettingsType } from '@/types/scopes/SettingsTypes';
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
    type: 'select',
    label: 'Room',
    column: 'room_id',
    fetchOptions: 'rooms',
    required: true,
    hidden: false,
    schema: yup.number().required(),
  },
  {
    type: 'select',
    label: 'Current Phase',
    column: 'phase_id',
    options: [
      { label: 'Discussion', value: 10 },
      { label: 'Approval', value: 20 },
      { label: 'Voting', value: 30 },
      { label: 'Results', value: 40 },
    ],
    required: true,
    hidden: false,
    schema: yup.number().required(),
  }
];

const requests = {
  id: `topic_id`,
  fetch: `getTopics`,
  get: `getTopicBaseData`,
  add: `addTopic`,
  edit: `editTopic`,
  delete: `deleteTopic`,
};

export const boxesSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;
