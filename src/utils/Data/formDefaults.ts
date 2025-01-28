import { PossibleFields } from '@/types/Scopes';
import { SettingNamesType } from '@/types/SettingsTypes';
import { t } from 'i18next';
import * as yup from 'yup';

// Defines all possible form field types supported in the application
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

// Type definition for select field options with label and numeric value
export type SelectOptionsType = { label: string; value: string | number };

// Array defining possible status options for status select fields
// Values correspond to different states: inactive (0), active (1), suspended (2), archived (3)
export const STATUS = [
  { label: 'status.inactive', value: 0 },
  { label: 'status.active', value: 1 },
  { label: 'status.suspended', value: 2 },
  { label: 'status.archived', value: 3 },
];

// Configuration type for form input fields
// Defines the structure and requirements for each form field
export type InputSettings = {
  name: keyof PossibleFields | Array<keyof PossibleFields>; // Field name(s) from PossibleFields type
  form: InputType; // Form configuration
  required: boolean; // Whether the field is mandatory
  role: 10 | 20 | 30 | 40 | 50 | 60; // Required role level to access/edit field
  phase?: 0 | 10 | 20 | 30 | 40; // Optional phase restriction
};

// Defines the structure of form input configuration
export type InputType = {
  type: FormTypes; // Type of form field
  defaultValue: string | number; // Default value for the field
  schema?: yup.Schema; // Yup validation schema
  options?: SelectOptionsType[] | SettingNamesType; // Options for select-type fields
};

// Pre-defined input type configurations for common form fields
export const inputType = {
  // Custom input type with string validation
  custom: {
    type: 'custom',
    defaultValue: '',
    schema: yup.string(),
  },

  // Duration input with integer validation and minimum value of 0
  duration: {
    type: 'duration',
    defaultValue: 14,
    schema: yup.number().integer(t('validation.int')).min(0, t('validation.positive')),
  },

  // Email input with email format validation and max length of 50
  email: {
    type: 'input',
    defaultValue: '',
    schema: yup
      .string()
      .email(t('validation.email'))
      .max(50, t('validation.max', { var: 50 })),
  },

  // Long text input for larger text content
  longText: {
    type: 'text',
    defaultValue: '',
    schema: yup.string(),
  },

  // Password input with length restrictions (4-32 characters)
  password: {
    type: 'password',
    defaultValue: '',
    schema: yup
      .string()
      .min(4, t('validation.min', { var: 4 }))
      .max(32, t('validation.max', { var: 32 })),
  },

  // Generic select input with numeric values
  select: {
    type: 'select',
    defaultValue: 0,
    schema: yup.number(),
  },

  // Short text input with length restrictions (3-100 characters)
  shortText: {
    type: 'input',
    defaultValue: '',
    schema: yup
      .string()
      .min(3, t('validation.min', { var: 3 }))
      .max(100, t('validation.max', { var: 100 })),
  },

  // Status select input using predefined STATUS options
  status: {
    type: 'select',
    defaultValue: 1,
    schema: yup.number(),
    options: STATUS,
  },
};
