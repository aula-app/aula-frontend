import * as yup from 'yup';

export const roomsSettings = {
  requests: {
    model: 'User',
    get: 'getUserBaseData',
    add: 'addUser',
    edit: 'editUserData',
    decrypt: ['about_me', 'displayname', 'email', 'realname', 'username'],
  },
  forms: {
    realname: yup.string().required(),
    displayname: yup.string().required(),
    email: yup.string().email().required(),
    about_me: yup.string(),
    username: yup.string().required(),
    position: yup.string(),
    userlevel: yup.number().required(),
  },
  options: {
    realname: {
      label: 'Student Name',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: false,
    },
    displayname: {
      label: 'Display Name',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: false,
    },
    email: {
      label: 'Email',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: false,
    },
    about_me: {
      label: 'Description',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: true,
    },
    username: {
      label: 'User Name',
      defaultValue: '',
      required: true,
      hidden: true,
      isText: false,
    },
    position: {
      label: 'Position',
      defaultValue: 0,
      required: true,
      hidden: true,
      isText: false,
    },
    userlevel: {
      label: 'user Level',
      defaultValue: 10,
      required: true,
      hidden: true,
      isText: false,
    },
  },
}