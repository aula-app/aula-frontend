import { inputType } from '../formDefaults';

export default [
  {
    name: 'title',
    form: inputType.shortText,
    required: true,
    role: 20,
  },
  {
    name: 'content',
    form: inputType.longText,
    required: true,
    role: 20,
  },
  {
    name: 'room_id',
    form: {
      ...inputType.select,
      required: true,
      options: 'rooms',
    },
    role: 50,
  },
  {
    name: 'approval_comment',
    form: inputType.longText,
    required: false,
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
    required: false,
    role: 50,
    phase: 20,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
];
