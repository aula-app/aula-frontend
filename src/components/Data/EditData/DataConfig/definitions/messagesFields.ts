import { inputType } from '../formDefaults';
import * as yup from 'yup';

export default [
  {
    name: ['room_id', 'target_id', 'target_group'],
    form: {
      type: 'target',
      defaultValue: 0,
      schema: yup.number(),
    },
    required: false,
    role: 30,
  },
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
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
];
