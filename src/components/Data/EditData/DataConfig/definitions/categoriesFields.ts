import { inputType } from '../formDefaults';

export default [
  {
    name: 'name',
    form: inputType.shortText,
    role: 20,
  },
  {
    name: 'description_internal',
    form: {
      type: 'icon',
      defaultValue: '',
    },
    role: 20,
  },
  {
    name: 'status',
    form: inputType.status,
    role: 50,
  },
];
