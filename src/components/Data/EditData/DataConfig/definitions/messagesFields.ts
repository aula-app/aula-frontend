import { inputType } from '../formDefaults';

export default [
  {
    name: 'headline',
    form: inputType.shortText,
    role: 50,
  },
  {
    name: 'body',
    form: inputType.longText,
    role: 50,
  },
  {
    name: 'user_needs_to_consent',
    form: {
      ...inputType.select,
      options: [
        { label: 'validation.consentNoNeed', value: 0 },
        { label: 'validation.consentOptional', value: 1 },
        { label: 'validation.consentNeeded', value: 2 },
      ],
    },
    role: 50,
  },
  {
    name: 'consent_text',
    form: inputType.shortText,
    role: 50,
  },
  {
    name: 'status',
    form: inputType.status,
    role: 50,
  },
];
