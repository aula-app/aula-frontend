import { inputType } from '../formDefaults';

export default [
  {
    name: 'group_name',
    form: inputType.shortText,
    required: true,
    role: 30,
  },
  {
    name: 'description_public',
    form: inputType.longText,
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
