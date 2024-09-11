import { BugType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';

interface BugFields extends FieldType {
  name: keyof BugType;
}

interface BugColumns extends ColumnSettings {
  name: keyof BugType;
}

const columns = [
  { name: 'headline', orderId: 5 },
  { name: 'body', orderId: 6 },
  { name: 'created', orderId: 4 },
  { name: 'creator_id', orderId: 3 },
  { name: 'last_update', orderId: 0 },
] as Array<BugColumns>;

const fields = [
  {
    name: 'body',
    required: true,
    form: inputType.longText,
    role: 10,
  },
  {
    name: 'status',
    required: true,
    form: inputType.status,
    role: 50,
  },
] as Array<BugFields>;

const requests = {
  name: 'bug',
  model: 'Message',
  item: 'Message',
  items: 'Messages',
  id: 'message_id',
  fetch: 'getMessages',
  get: 'getMessageBaseData',
  add: 'addMessage',
  edit: 'editMessage',
  delete: 'deleteMessage',
} as DataRequestsType;

export default { fields, columns, requests };
