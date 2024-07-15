import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'ideas';
const item = 'idea';
const model = 'Idea';
const isChild = 'boxes';

const rows = [
  {
    id: 9,
    name: 'title',
  },
  {
    id: 7,
    name: 'content',
  },
  {
    id: 2,
    name: 'created',
  },
  {
    id: 3,
    name: 'last_update',
  },
  {
    id: 8,
    name: 'room_id',
  },
];

const forms = [
  {
    type: 'input',
    name: 'title',
    required: true,
    hidden: false,
    schema: yup.string().max(50, 'Must be smaller than 50 characters').required(),
  },
  {
    type: 'text',
    name: 'content',
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
];

const requests = {
  id: 'idea_id',
  fetch: 'getIdeas',
  get: 'getIdeaBaseData',
  add: 'addIdea',
  edit: 'editIdea',
  delete: 'deleteIdea',
  move: 'addIdeaToTopic',
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
