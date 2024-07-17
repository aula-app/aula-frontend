import { SettingNamesType } from '@/types/scopes/SettingsTypes';
import i18next from 'i18next';
import * as yup from 'yup';

export type SelectOptionsType = { label: string; value: number };
type FormTypes = 'input' | 'password' | 'select' | 'text';
type FormSetting = {
  type: FormTypes;
  schema: yup.Schema;
  options?: SelectOptionsType[] | SettingNamesType;
};

const t = i18next.t;

const shortText = {
  type: 'input',
  schema: yup
    .string()
    .max(50, t('validation.max', { var: 50 }))
    .required(t('validation.required')),
};

const longText = {
  type: 'text',
  schema: yup.string().required(t('validation.required')),
};

const password = {
  type: 'password',
  schema: yup
    .string()
    .min(4, t('validation.min', { var: 4 }))
    .max(32, t('validation.max', { var: 32 }))
    .required(t('validation.required')),
};

export const formsSettings = {
  about_me: longText,
  body: longText,
  content: longText,
  consent_text: shortText,
  confirmPassword: password,
  description: longText,
  description_public: longText,
  displayname: shortText,
  email: {
    type: 'input',
    schema: yup.string().email(t('validation.email')).required(t('validation.required')),
  },
  headline: shortText,
  name: shortText,
  password: {
    type: 'password',
    schema: yup
      .string()
      .min(4, t('validation.min', { var: 4 }))
      .max(32, t('validation.max', { var: 32 }))
      .required(t('validation.required')),
  },
  path: {
    type: 'input',
    schema: yup.string().required(t('validation.required')),
  },
  phase_id: {
    type: 'select',
    schema: yup.number().required(t('validation.required')),
    options: [
      { label: 'Discussion', value: 10 },
      { label: 'Approval', value: 20 },
      { label: 'Voting', value: 30 },
      { label: 'Results', value: 40 },
    ],
  },
  realname: {
    type: 'input',
    schema: yup.string().required(t('validation.required')),
  },
  room_id: {
    type: 'select',
    schema: yup.number().required(t('validation.required')),
    options: 'rooms',
  },
  room_name: shortText,
  status: {
    type: 'select',
    schema: yup.number().required(t('validation.required')),
    options: [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 },
    ],
  },
  title: shortText,
  user_id: shortText,
  user_needs_to_consent: {
    type: 'select',
    schema: yup.number().required(t('validation.required')),
    options: [
      { label: 'No consent', value: 0 },
      { label: 'Optional', value: 1 },
      { label: 'Mandatory', value: 2 },
    ],
  },
  username: shortText,
} as Record<string, FormSetting>;
