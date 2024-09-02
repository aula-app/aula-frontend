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
];
