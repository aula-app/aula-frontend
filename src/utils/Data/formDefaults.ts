import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { t } from 'i18next';
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
  | 'singleDuration'
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
    defaultValue: '',
    schema: yup.string(),
  },

  duration: {
    type: 'duration',
    defaultValue: 14,
    schema: yup.number().integer(t('validation.int')).positive(t('validation.positive')),
  },

  email: {
    type: 'input',
    defaultValue: '',
    schema: yup
      .string()
      .email(t('validation.email'))
      .max(50, t('validation.max', { var: 50 })),
  },

  longText: {
    type: 'text',
    defaultValue: '',
    schema: yup.string(),
  },

  password: {
    type: 'password',
    defaultValue: '',
    schema: yup
      .string()
      .min(4, t('validation.min', { var: 4 }))
      .max(32, t('validation.max', { var: 32 })),
  },

  select: {
    type: 'select',
    defaultValue: 0,
    schema: yup.number(),
  },

  shortText: {
    type: 'input',
    defaultValue: '',
    schema: yup
      .string()
      .min(3, t('validation.min', { var: 3 }))
      .max(100, t('validation.max', { var: 100 })),
  },

  status: {
    type: 'select',
    defaultValue: 1,
    schema: yup.number(),
    options: STATUS,
  },
};
