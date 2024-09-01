import { SettingNamesType } from '@/types/SettingsTypes';
import * as yup from 'yup';

export type SelectOptionsType = { label: string; value: number };
type FormTypes = 'input' | 'password' | 'select' | 'text' | 'icon' | 'image' | 'duration';
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
};
