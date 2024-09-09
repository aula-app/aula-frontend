import { inputType } from '../formDefaults';

export default [
  {
    name: 'body',
    required: true,
    form: inputType.longText,
    role: 10,
  },
  {
    name: 'status',
    required: true,
    form: inputType.status,
    role: 50,
  },
];
