import { inputType } from '../formDefaults';

export default [
  {
    name: 'displayname',
    form: inputType.shortText,
    role: 20,
  },
  {
    name: 'realname',
    form: inputType.shortText,
    role: 20,
  },
  {
    name: 'username',
    form: inputType.shortText,
    role: 50,
  },
  {
    name: 'email',
    form: inputType.shortText,
    role: 20,
  },
  {
    name: 'about_me',
    form: inputType.longText,
    role: 20,
  },
  {
    name: 'userlevel',
    form: {
      ...inputType.select,
      defaultValue: 20,
      options: [
        { label: 'roles.10', value: 10 },
        { label: 'roles.20', value: 20 },
        { label: 'roles.30', value: 30 },
        { label: 'roles.40', value: 40 },
        { label: 'roles.50', value: 50 },
      ],
    },
    role: 50,
  },
];
