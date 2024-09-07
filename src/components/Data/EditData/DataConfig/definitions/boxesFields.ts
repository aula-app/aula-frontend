import { checkPermissions } from '@/utils';
import { inputType } from '../formDefaults';

export default [
  {
    name: 'name',
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
    name: 'room_id',
    form: {
      ...inputType.select,
      options: 'rooms',
    },
    required: true,
    role: 30,
  },
  {
    name: 'phase_id',
    form: {
      type: 'phaseSelect',
      defaultValue: 10,
    },
    required: true,
    role: 30,
  },
  {
    name: ['phase_duration_1', 'phase_duration_2', 'phase_duration_3', 'phase_duration_4'],
    form: inputType.duration,
    required: true,
    role: 30,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
];
