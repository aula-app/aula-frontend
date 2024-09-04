import { SettingNamesType } from '@/types/SettingsTypes';
import * as yup from 'yup';

export type SelectOptionsType = { label: string; value: number };

type FormTypes = 'duration' | 'icon' | 'image' | 'input' | 'password' | 'phaseSelect' | 'select' | 'text';

export const STATUS = [
  { label: 'status.inactive', value: 0 },
  { label: 'status.active', value: 1 },
  { label: 'status.suspended', value: 2 },
  { label: 'status.archived', value: 3 },
];

export type inputType = {
  type: FormTypes;
  defaultValue: string | number;
  schema?: yup.Schema;
  options?: SelectOptionsType[] | SettingNamesType;
};

export const inputType = {
  duration: {
    type: 'duration',
    defaultValue: 7,
    schema: yup.number().min(1, 'validation.min'),
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
