import { inputType } from '../formDefaults';

export default [
  {
    name: 'headline',
    form: inputType.shortText,
    required: true,
    role: 10,
  },
  {
    name: 'body',
    form: inputType.longText,
    required: true,
    role: 10,
  },
  {
    name: 'room_id',
    form: {
      ...inputType.select,
      options: 'rooms',
    },
    required: false,
    role: 30,
  },
  {
    name: 'target_id',
    form: {
      ...inputType.select,
      options: 'users',
    },
    required: false,
    role: 30,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
];
