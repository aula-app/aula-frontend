import { inputType } from '../formDefaults';

export default [
  {
    name: 'name',
    form: inputType.shortText,
    role: 30,
  },
  {
    name: 'description_public',
    form: inputType.longText,
    role: 30,
  },
  {
    name: 'room_id',
    form: {
      ...inputType.select,
      options: 'rooms',
    },
    role: 30,
  },
  {
    name: 'phase_id',
    form: {
      ...inputType.select,
      defaultValue: 10,
      options: [
        { label: 'phases.discussion', value: 10 },
        { label: 'phases.approval', value: 20 },
        { label: 'phases.voting', value: 30 },
        { label: 'phases.results', value: 40 },
      ],
    },
    role: 30,
  },
  {
    name: 'phase_duration_1',
    form: inputType.duration,
    role: 30,
  },
  {
    name: 'phase_duration_2',
    form: inputType.duration,
    role: 30,
  },
  {
    name: 'phase_duration_3',
    form: inputType.duration,
    role: 30,
  },
  {
    name: 'phase_duration_4',
    form: inputType.duration,
    role: 30,
  },
];
