import { SettingsType } from '@/types/SettingsTypes';
import * as yup from 'yup';

const name = 'Messages';
const item = 'Text';
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
    type: 'input',
    label: 'Consent text',
    column: 'consent_text',
    defaultValue: 'Agree',
    required: true,
    hidden: false,
    schema: yup.string().required(),
  },
  {
    type: 'input',
    label: 'Location',
    column: 'location',
    defaultValue: '',
    required: true,
    hidden: true,
    schema: yup.string(),
  },
  {
    type: 'input',
    label: 'Creator ID',
    column: 'creator_id',
    defaultValue: 1,
    required: true,
    hidden: true,
    schema: yup.number().required(),
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
      { label: 'Inactive', value: 0 },
      { label: 'Active', value: 1 },
    ],
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

export const textsSettings = {
  name,
  item,
  model,
  rows,
  forms,
  requests,
} as SettingsType;