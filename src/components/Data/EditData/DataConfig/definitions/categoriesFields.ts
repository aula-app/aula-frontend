import { inputType } from '../formDefaults';

export default [
  {
    name: 'name',
    form: inputType.shortText,
    required: true,
    role: 20,
  },
  {
    name: 'description_internal',
    form: {
      type: 'icon',
      defaultValue: '',
    },
    required: false,
    role: 20,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
];
