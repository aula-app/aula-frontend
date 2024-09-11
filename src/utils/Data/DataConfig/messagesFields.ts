import { MessageType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import * as yup from 'yup';
import { inputType } from '../formDefaults';

interface MessageFields extends FieldType {
  name: keyof MessageType;
}

interface MessageColumns extends ColumnSettings {
  name: keyof MessageType;
}

const columns = [
  { name: 'headline', orderId: 5 },
  { name: 'body', orderId: 6 },
  { name: 'created', orderId: 4 },
  { name: 'creator_id', orderId: 3 },
  { name: 'last_update', orderId: 0 },
] as Array<MessageColumns>;

const fields = [
  {
    name: ['room_id', 'target_id', 'target_group'],
    form: {
      type: 'target',
      defaultValue: 0,
      schema: yup.number(),
    },
    required: false,
    role: 30,
  },
  {
    name: 'headline',
    form: inputType.shortText,
    required: true,
    role: 10,
  },
  {
    name: 'body',
    form: inputType.longText,
    required: true,
    role: 10,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<MessageFields>;

const requests = {
  name: 'messages',
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
