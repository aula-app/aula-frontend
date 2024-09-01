import { inputType } from '../formDefaults';

export default [
  {
    name: 'title',
    form: inputType.shortText,
    role: 20,
  },
  {
    name: 'content',
    form: inputType.longText,
    role: 20,
  },
  {
    name: 'room_id',
    form: {
      ...inputType.select,
      options: 'rooms',
    },
    role: 50,
  },
  {
    name: 'approval_comment',
    form: inputType.longText,
    role: 50,
    phase: 20,
  },
  {
    name: 'approved',
    form: {
      ...inputType.select,
      options: [
        { label: '-', value: 0 },
        { label: 'generics.no', value: -1 },
        { label: 'generics.yes', value: 1 },
      ],
    },
    role: 50,
    phase: 20,
  },
];
