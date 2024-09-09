import { inputType } from '../formDefaults';

export default [
  {
    name: 'body',
    form: inputType.longText,
    required: true,
    role: 10,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
];
