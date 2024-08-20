import { SettingNamesType } from '@/types/SettingsTypes';
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
  defaultValue: '',
  schema: yup.string().max(100, 'validation.max').required('validation.required'),
};

const longText = {
  type: 'text',
  defaultValue: '',
  schema: yup.string().required('validation.required'),
};

const notRequiredLongText = {
  type: 'text',
  defaultValue: '',
  schema: yup.string(),
};

const password = {
  type: 'password',
  defaultValue: '',
  schema: yup.string().min(4, 'validation.min').max(32, 'validation.max').required('validation.required'),
};

const duration = {
  type: 'duration',
  defaultValue: 7,
  schema: yup.number().min(1, 'validation.min').required('validation.required'),
};

export const formsSettings = {
  about_me: notRequiredLongText,
  approval_comment: {
    type: 'text',
    schema: yup.string(),
  },
  approved: {
    type: 'select',
    schema: yup.number(),
    defaultValue: 0,
    options: [
      { label: '-', value: 0 },
      { label: 'generics.no', value: -1 },
      { label: 'generics.yes', value: 1 },
    ],
  },
  body: longText,
  content: longText,
  consent_text: {
    ...shortText,
    defaultValue: 'Agree',
  },
  confirmPassword: password,
  description: longText,
  description_public: longText,
  description_internal: shortText,
  displayname: shortText,
  email: {
    type: 'input',
    defaultValue: '',
    schema: yup.string().email('validation.email').required('validation.required'),
  },
  headline: shortText,
  name: shortText,
  password: {
    type: 'password',
    defaultValue: '',
    schema: yup.string().min(4, 'validation.min').max(32, 'validation.max').required('validation.required'),
  },
  path: {
    type: 'input',
    defaultValue: '',
    schema: yup.string().required('validation.required'),
  },
  phase_id: {
    type: 'select',
    schema: yup.number().required('validation.required'),
    defaultValue: 10,
    options: [
      { label: 'phases.discussion', value: 10 },
      { label: 'phases.approval', value: 20 },
      { label: 'phases.voting', value: 30 },
      { label: 'phases.results', value: 40 },
    ],
  },
  phase_duration_0: duration,
  phase_duration_1: duration,
  phase_duration_2: duration,
  phase_duration_3: duration,
  phase_duration_4: duration,
  realname: {
    type: 'input',
    defaultValue: '',
    schema: yup.string().required('validation.required'),
  },
  room_id: {
    type: 'select',
    schema: yup.number().required('validation.required'),
    options: 'rooms',
  },
  room_name: shortText,
  status: {
    type: 'select',
    schema: yup.number().required('validation.required'),
    defaultValue: 1,
    options: [
      { label: 'generics.active', value: 1 },
      { label: 'generics.inactive', value: 0 },
    ],
  },
  title: shortText,
  user_id: shortText,
  userlevel: {
    type: 'select',
    schema: yup.number().required('validation.required'),
    defaultValue: 20,
    options: [
      { label: 'roles.10', value: 10 },
      { label: 'roles.20', value: 20 },
      { label: 'roles.30', value: 30 },
      { label: 'roles.40', value: 40 },
      { label: 'roles.50', value: 50 },
    ],
  },
  user_needs_to_consent: {
    type: 'select',
    schema: yup.number().required('validation.required'),
    defaultValue: 0,
    options: [
      { label: 'validation.consentNoNeed', value: 0 },
      { label: 'validation.consentOptional', value: 1 },
      { label: 'validation.consentNeeded', value: 2 },
    ],
  },
  username: shortText,
} as Record<string, FormSetting>;
