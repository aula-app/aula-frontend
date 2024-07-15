import { SettingsType } from '@/types/scopes/SettingsTypes';
import * as yup from 'yup';

const name = 'messages';
const item = 'message';
const model = 'Text';

const rows = [
  {
    id: 2,
    name: 'created',
  },
  {
    id: 5,
    name: 'headline',
  },
  {
    id: 6,
    name: 'body',
  },
];

const forms = [
  {
    type: 'input',
    name: 'headline',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    name: 'body',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'select',
    name: 'user_needs_to_consent',
    options: [
      { label: 'No consent', value: 0 },
      { label: 'Optional', value: 1 },
      { label: 'Mandatory', value: 2 },
    ],
    required: true,
    hidden: false,
    schema: yup.number().required(),
  },
  {
    type: 'select',
    name: 'status',
    options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 },
    ],
    required: true,
    hidden: false,
    schema: yup.number().required(),
  },
  {
    type: 'input',
    name: 'consent_text',
    value: 'Agree',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
];

const requests = {
  id: 'text_id',
  fetch: 'getTexts',
  get: 'getTextBaseData',
  add: 'addText',
  edit: 'editText',
  delete: 'deleteText',
};

export const messagesSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;
