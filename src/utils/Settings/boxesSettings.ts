import * as yup from 'yup';

const definitions = {
  name: 'Boxes',
  itemName: 'Box',
};

const requests = {
  model: 'Topic',
  method: 'getTopics',
  id: 'topic_id',
  get: 'getTopicBaseData',
  add: 'addTopic',
  edit: 'editTopic',
  delete: 'deleteTopic',
  decrypt: ['name', 'description_internal', 'description_public'],
};

const forms = [
  {
    name: 'name',
    label: 'Name',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: false,
    schema: yup.string().required(),
  },
  {
    name: 'description_public',
    label: 'Public Description',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: true,
    schema: yup.string().required(),
  },
  {
    name: 'description_internal',
    label: 'Internal Description',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: true,
    schema: yup.string(),
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
    id: 1,
    name: 'name',
    displayName: 'Name',
    encryption: true,
  },
  {
    id: 5,
    name: 'description_internal',
    displayName: 'Public description',
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

export const boxesSettings = {
  definitions,
  requests,
  forms,
  rows,
};
