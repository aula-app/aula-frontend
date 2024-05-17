import * as yup from 'yup';

const definitions = {
  name: 'Users',
  itemName: 'User',
  generates: 'rooms',
};

const requests = {
  model: 'User',
  method: 'getUsers',
  id: 'user_id',
  get: 'getUserBaseData',
  add: 'addUser',
  edit: 'editUserData',
  delete: 'deleteUser',
  decrypt: ['about_me', 'displayname', 'email', 'realname', 'username'],
};

const forms = [
  {
    name: 'realname',
    label: 'Student Name',
    schema: yup.string().required(),
    defaultValue: '',
    required: true,
    hidden: false,
    isText: false,
  },
  {
    name: 'displayname',
    label: 'Display Name',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: false,
    schema: yup.string().required(),
  },
  {
    name: 'email',
    label: 'Email',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: false,
    schema: yup.string().email().required(),
  },
  {
    name: ' about_me',
    label: 'Description',
    defaultValue: '',
    required: true,
    hidden: false,
    isText: true,
    schema: yup.string(),
  },
  {
    name: ' username',
    label: 'User Name',
    defaultValue: '',
    required: true,
    hidden: true,
    isText: false,
    schema: yup.string().required(),
  },
  {
    name: ' position',
    label: 'Position',
    defaultValue: 0,
    required: true,
    hidden: true,
    isText: false,
    schema: yup.string().required(),
  },
  {
    name: 'userlevel',
    label: 'user Level',
    defaultValue: 10,
    required: true,
    hidden: true,
    isText: false,
    schema: yup.number().required(),
  },
];

const rows = [
  {
    id: 1,
    name: 'realname',
    displayName: 'Student Name',
    encryption: true,
  },
  {
    id: 6,
    name: 'displayname',
    displayName: 'User Name',
    encryption: true,
  },
  {
    id: 7,
    name: 'email',
    displayName: 'Email',
    encryption: true,
  },
];

export const usersSettings = {
  definitions,
  requests,
  forms,
  rows,
};
