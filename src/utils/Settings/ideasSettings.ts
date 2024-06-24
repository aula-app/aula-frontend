import { SettingsType } from '@/types/SettingsTypes';
import * as yup from 'yup';

const name = 'Ideas';
const item = 'Idea';
const model = 'Idea';
const isChild = 'boxes';

const rows = [
  {
    id: 9,
    name: 'title',
    displayName: 'Title',
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
  {
    id: 8,
    name: 'room_id',
    displayName: 'Room',
  },
];

const forms = [
  {
    type: 'input',
    label: 'Title',
    column: 'title',
    required: true,
    hidden: false,
    schema: yup.string().max(50, 'Must be smaller than 50 characters').required(),
  },
  {
    type: 'text',
    label: 'Content',
    column: 'content',
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
];

const requests = {
  id: `idea_id`,
  fetch: `getIdeas`,
  get: `getIdeaBaseData`,
  add: `addIdea`,
  edit: `editIdea`,
  delete: `deleteIdea`,
};

export const ideasSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
  isChild,
} as SettingsType;
