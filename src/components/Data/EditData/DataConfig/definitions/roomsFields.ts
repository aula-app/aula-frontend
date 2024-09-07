import { inputType } from '../formDefaults';

export default [
  {
    name: 'room_name',
    form: inputType.shortText,
    required: true,
    role: 50,
  },
  {
    name: 'description_public',
    form: inputType.longText,
    required: false,
    role: 50,
  },
  {
    name: 'description_internal',
    form: {
      type: 'image',
      defaultValue: 'DI:0:0',
    },
    required: false,
    role: 50,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
];
