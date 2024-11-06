import { AnnouncementType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';

interface AnnouncementFields extends FieldType {
  name: keyof AnnouncementType;
}

interface AnnouncementColumns extends ColumnSettings {
  name: keyof AnnouncementType;
}

const columns = [
  { name: 'headline', orderId: 5 },
  { name: 'body', orderId: 6 },
  { name: 'user_needs_to_consent', orderId: 8 },
  { name: 'creator_id', orderId: 3 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<AnnouncementColumns>;

const fields = [
  {
    name: 'headline',
    form: inputType.shortText,
    required: true,
    role: 50,
  },
  {
    name: 'body',
    form: inputType.longText,
    required: true,
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
    required: true,
    role: 50,
  },
  {
    name: 'consent_text',
    form: inputType.shortText,
    required: true,
    role: 50,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<AnnouncementFields>;

const requests = {
  name: 'announcements',
  model: 'Text',
  item: 'Text',
  items: 'Texts',
  id: 'text_id',
  fetch: 'getTexts',
  get: 'getTextBaseData',
  add: 'addText',
  edit: 'editText',
  delete: 'deleteText',
} as DataRequestsType;

export default { fields, columns, requests };
