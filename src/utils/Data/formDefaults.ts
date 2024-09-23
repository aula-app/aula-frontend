import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import * as yup from 'yup';

type FormTypes =
  | 'custom'
  | 'duration'
  | 'icon'
  | 'image'
  | 'input'
  | 'password'
  | 'phaseSelect'
  | 'select'
  | 'target'
  | 'text';
export type SelectOptionsType = { label: string; value: number };

export const STATUS = [
  { label: 'status.inactive', value: 0 },
  { label: 'status.active', value: 1 },
  { label: 'status.suspended', value: 2 },
  { label: 'status.archived', value: 3 },
];

export type InputSettings = {
  name: keyof PossibleFields;
  form: InputType;
  required: boolean;
  role: 10 | 20 | 30 | 40 | 50 | 60;
  phase?: 0 | 10 | 20 | 30 | 40;
};

export type InputType = {
  type: FormTypes;
  defaultValue: string | number;
  schema?: yup.Schema;
  options?: SelectOptionsType[] | SettingNamesType;
};

export const inputType = {
  custom: {
    type: 'custom',
    schema: yup.string(),
  },

  duration: {
    type: 'duration',
    defaultValue: 7,
    schema: yup.number().min(1, 'validation.min'),
  },

  email: {
    type: 'input',
    defaultValue: '',
    schema: yup.string().email('validation.email').max(100, 'validation.max'),
  },

  longText: {
    type: 'text',
    defaultValue: '',
    schema: yup.string(),
  },

  password: {
    type: 'password',
    defaultValue: '',
    schema: yup.string().min(4, 'validation.min').max(32, 'validation.max'),
  },

  select: {
    type: 'select',
    defaultValue: 0,
    schema: yup.number(),
  },

  shortText: {
    type: 'input',
    defaultValue: '',
    schema: yup.string().max(100, 'validation.max'),
  },

  status: {
    type: 'select',
    defaultValue: 1,
    schema: yup.number(),
    options: STATUS,
  },
};
