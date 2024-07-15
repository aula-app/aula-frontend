import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'boxes';
const item = 'box';
const model = 'Topic';

const rows = [
  {
    id: 1,
    name: 'name',
  },
  {
    id: 5,
    name: 'description_public',
  },
  {
    id: 2,
    name: 'created',
  },
  {
    id: 3,
    name: 'last_update',
  },
];

const forms = [
  {
    type: 'input',
    name: 'name',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'text',
    name: 'description_public',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'select',
    name: 'room_id',
    fetchOptions: 'rooms',
    required: true,
    hidden: false,
    schema: yup.number().required(),
  },
  {
    type: 'select',
    name: 'phase_id',
    options: [
      { label: 'Discussion', value: 10 },
      { label: 'Approval', value: 20 },
      { label: 'Voting', value: 30 },
      { label: 'Results', value: 40 },
    ],
    required: true,
    hidden: false,
    schema: yup.number().required(),
  },
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
