import { SettingNamesType } from '@/types/SettingsTypes';
import i18next from 'i18next';
import * as yup from 'yup';

export type SelectOptionsType = { label: string; value: number };
type FormTypes = 'input' | 'password' | 'select' | 'text' | 'image' | 'duration';
type FormSetting = {
  type: FormTypes;
  schema: yup.Schema;
  options?: SelectOptionsType[] | SettingNamesType;
  defaultValue?: string | number;
};

const shortText = {
  type: 'input',
  schema: yup
    .string()
    .max(100, i18next.t('validation.max', { var: 100 }))
    .required(i18next.t('validation.required')),
};

const longText = {
  type: 'text',
  schema: yup.string().required(i18next.t('validation.required')),
};

const password = {
  type: 'password',
  schema: yup
    .string()
    .min(4, i18next.t('validation.min', { var: 4 }))
    .max(32, i18next.t('validation.max', { var: 32 }))
    .required(i18next.t('validation.required')),
};

const duration = {
  type: 'duration',
  defaultValue: 7,
  schema: yup
    .number()
    .min(1, i18next.t('validation.min', { var: 1 }))
    .required(i18next.t('validation.required')),
};

export const formsSettings = {
  about_me: longText,
  body: longText,
  content: longText,
  consent_text: shortText,
  confirmPassword: password,
  description: longText,
  description_public: longText,
  description_internal: shortText,
  displayname: shortText,
  email: {
    type: 'input',
    schema: yup.string().email(i18next.t('validation.email')).required(i18next.t('validation.required')),
  },
  headline: shortText,
  name: shortText,
  password: {
    type: 'password',
    schema: yup
      .string()
      .min(4, i18next.t('validation.min', { var: 4 }))
      .max(32, i18next.t('validation.max', { var: 32 }))
      .required(i18next.t('validation.required')),
  },
  path: {
    type: 'input',
    schema: yup.string().required(i18next.t('validation.required')),
  },
  phase_id: {
    type: 'select',
    schema: yup.number().required(i18next.t('validation.required')),
    defaultValue: 10,
    options: [
      { label: i18next.t('phases.discussion'), value: 10 },
      { label: i18next.t('phases.approval'), value: 20 },
      { label: i18next.t('phases.voting'), value: 30 },
      { label: i18next.t('phases.results'), value: 40 },
    ],
  },
  phase_duration_0: duration,
  phase_duration_1: duration,
  phase_duration_2: duration,
  phase_duration_3: duration,
  phase_duration_4: duration,
  realname: {
    type: 'input',
    schema: yup.string().required(i18next.t('validation.required')),
  },
  room_id: {
    type: 'select',
    schema: yup.number().required(i18next.t('validation.required')),
    options: 'rooms',
  },
  room_name: shortText,
  status: {
    type: 'select',
    schema: yup.number().required(i18next.t('validation.required')),
    defaultValue: 1,
    options: [
      { label: i18next.t('generics.active'), value: 1 },
      { label: i18next.t('generics.inactive'), value: 0 },
    ],
  },
  title: shortText,
  user_id: shortText,
  userlevel: {
    type: 'select',
    schema: yup.number().required(i18next.t('validation.required')),
    defaultValue: 20,
    options: [
      { label: i18next.t('roles.10'), value: 10 },
      { label: i18next.t('roles.20'), value: 20 },
      { label: i18next.t('roles.30'), value: 30 },
      { label: i18next.t('roles.40'), value: 40 },
      { label: i18next.t('roles.50'), value: 50 },
    ],
  },
  user_needs_to_consent: {
    type: 'select',
    schema: yup.number().required(i18next.t('validation.required')),
    defaultValue: 0,
    options: [
      { label: i18next.t('validation.consentNoNeed'), value: 0 },
      { label: i18next.t('validation.consentOptional'), value: 1 },
      { label: i18next.t('validation.consentNeeded'), value: 2 },
    ],
  },
  username: shortText,
} as Record<string, FormSetting>;
