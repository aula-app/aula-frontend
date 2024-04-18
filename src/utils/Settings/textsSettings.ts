import * as yup from 'yup';

export const textsSettings = {
  requests: {
    model: 'Text',
    get: 'getTextBaseData',
    add: 'addText',
    edit: 'editText',
    decrypt: [],
  },
  forms: {
    headline: yup.string().required(),
    body: yup.string().required(),
    consent_text: yup.string().required(),
    location: yup.string(),
    creator_id: yup.number().required(),
    user_needs_to_consent: yup.number().required(),
    service_id_consent: yup.number().required(),
    status: yup.number().required(),
  },
  options: {
    headline: {
      label: 'Headline',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: false,
    },
    body: {
      label: 'Message',
      defaultValue: '',
      required: true,
      hidden: false,
      isText: true,
    },
    consent_text: {
      label: 'Consent text',
      defaultValue: 'Agree',
      required: true,
      hidden: false,
      isText: false,
    },
    location: {
      label: 'Location',
      defaultValue: '',
      required: true,
      hidden: true,
      isText: false,
    },
    creator_id: {
      label: 'Creator ID',
      defaultValue: 1,
      required: true,
      hidden: true,
      isText: false,
    },
    user_needs_to_consent: {
      label: 'Consent needed',
      defaultValue: 0,
      required: true,
      hidden: true,
      isText: false,
    },
    service_id_consent: {
      label: 'No documentation',
      defaultValue: 0,
      required: true,
      hidden: true,
      isText: false,
    },
    status: {
      label: 'Status',
      defaultValue: 1,
      required: true,
      hidden: true,
      isText: false,
    }
  },
}