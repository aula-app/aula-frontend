import { SettingsType } from '@/types/SettingsTypes';
import * as yup from 'yup';

const name = 'Messages';
const item = 'Message';
const model = 'Text';

const rows = [
  {
    id: 2,
    name: 'created',
    displayName: 'Date Created',
  },
  {
    id: 5,
    name: 'headline',
    displayName: 'Headline',
  },
  {
    id: 6,
    name: 'body',
    displayName: 'Message',
  },
];

const forms = [
  {
    type: 'input',
    label: 'Headline',
    column: 'headline',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    label: 'Message',
    column: 'body',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'select',
    label: 'Consent',
    column: 'user_needs_to_consent',
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
    label: 'Status',
    column: 'status',
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
    label: 'Consent text',
    column: 'consent_text',
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
