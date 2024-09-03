import { inputType } from '../formDefaults';

export default [
  {
    name: 'room_name',
    form: inputType.shortText,
    role: 50,
  },
  {
    name: 'description_public',
    form: inputType.longText,
    role: 50,
  },
  {
    name: 'description_internal',
    form: {
      type: 'image',
      defaultValue: 'DI:0:0',
    },
    role: 50,
  },
  {
    name: 'status',
    form: inputType.status,
    role: 50,
  },
];
