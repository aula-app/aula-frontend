import * as yup from 'yup';

const definitions = {
  name: 'Ideas',
  itemName: 'Idea',
  generates: 'boxes',
};

const requests = {
  model: 'Idea',
  method: 'getIdeas',
  id: 'idea_id',
  get: 'getIdeaBaseData',
  add: 'addIdea',
  edit: 'editIdea',
  delete: 'deleteIdea',
  decrypt: ['content'],
};

const forms = [
  {
    name: 'content',
    label: 'Content',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: true,
    schema: yup.string().required(),
  },
  {
    name: 'user_id',
    label: 'User ID',
    defaultValue: '',
    required: true,
    hidden: true,
    isText: false,
    schema: yup.number().required(),
  },
  {
    name: 'room_id',
    label: 'Room ID',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: false,
    schema: yup.number().required(),
  },
];

const rows = [
  {
    id: 8,
    name: 'room_id',
    displayName: 'Room ID',
    encryption: false,
  },
  {
    id: 7,
    name: 'content',
    displayName: 'Idea',
    encryption: true,
  },
  {
    id: 2,
    name: 'created',
    displayName: 'Date Created',
    encryption: false,
  },
  {
    id: 3,
    name: 'last_update',
    displayName: 'Date Last Updated',
    encryption: false,
  },
];

export const ideasSettings = {
  definitions,
  requests,
  forms,
  rows,
};
