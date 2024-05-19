import * as yup from 'yup';

const definitions = {
  name: 'Messages',
  itemName: 'Text',
};

const requests = {
  model: 'Text',
  method: 'getTexts',
  id: 'text_id',
  get: 'getTextBaseData',
  add: 'addText',
  edit: 'editText',
  delete: 'deleteText',
  decrypt: [],
};

const forms = [
  {
    name: 'headline',
    label: 'Headline',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: false,
    schema: yup.string().required(),
  },
  {
    name: 'body',
    label: 'Message',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: true,
    schema: yup.string().required(),
  },
  {
    name: 'consent_text',
    label: 'Consent text',
    defaultValue: 'Agree',
    required: true,
    hidden: false,
    isText: false,
    schema: yup.string().required(),
  },
  {
    name: 'location',
    label: 'Location',
    defaultValue: '',
    required: true,
    hidden: true,
    isText: false,
    schema: yup.string(),
  },
  {
    name: 'creator_id',
    label: 'Creator ID',
    defaultValue: 1,
    required: true,
    hidden: true,
    isText: false,
    schema: yup.number().required(),
  },
  {
    name: 'user_needs_to_consent',
    label: 'Consent needed',
    defaultValue: 0,
    required: true,
    hidden: true,
    isText: false,
    schema: yup.number().required(),
  },
  {
    name: 'service_id_consent',
    label: 'No documentation',
    defaultValue: 0,
    required: true,
    hidden: true,
    isText: false,
    schema: yup.number().required(),
  },
  {
    name: 'status',
    label: 'Status',
    defaultValue: 1,
    required: true,
    hidden: true,
    isText: false,
    schema: yup.number().required(),
  },
];

const rows = [
  {
    "id": 2,
    "name": "created",
    "displayName": "Date Created",
    "encryption": false
  },
  {
    "id": 5,
    "name": "headline",
    "displayName": "Headline",
    "encryption": false
  },
  {
    "id": 6,
    "name": "body",
    "displayName": "Message",
    "encryption": false
  }
];

export const textsSettings = {
  definitions,
  requests,
  forms,
  rows,
};
