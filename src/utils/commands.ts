import { PossibleFields } from '@/types/Scopes';
import { InputType } from './Data/formDefaults';

export const InstanceStatusOptions = [
  { value: 0, label: 'status.inactive' },
  { value: 1, label: 'status.active' },
  { value: 2, label: 'status.weekend' },
  { value: 3, label: 'status.vacation' },
  { value: 4, label: 'status.holiday' },
];

export type InputSettings = {
  name: keyof PossibleFields;
  form: InputType;
  required: boolean;
  role: 10 | 20 | 30 | 40 | 50 | 60;
  phase?: 0 | 10 | 20 | 30 | 40;
};

export const Commands = [
  {
    label: 'set',
    value: 10,
    options: [{ label: 'instanceStatus', options: InstanceStatusOptions }],
  },
  {
    label: 'activate',
    value: 20,
    options: [
      { label: 'user', options: 'users' },
      { label: 'room', options: 'rooms' },
    ],
  },
  {
    label: 'deactivate',
    value: 30,
    options: [
      { label: 'user', options: 'users' },
      { label: 'room', options: 'rooms' },
    ],
  },
];
