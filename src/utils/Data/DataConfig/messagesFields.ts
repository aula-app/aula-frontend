// Import necessary types for announcements, column settings, and form input configurations
import { MessageType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import * as yup from 'yup';
import { inputType } from '../formDefaults';

// Interface defining the structure of fields, extending the base FieldType
// with a specific name property that must be a key of MessageType
interface MessageFields extends FieldType {
  name: keyof MessageType;
}

// Interface defining the structure of columns, extending ColumnSettings
// with a specific name property that must be a key of MessageType
interface MessageColumns extends ColumnSettings {
  name: keyof MessageType;
}

// Configuration for table columns display order
// Each object defines a column with its name and order position
const columns = [
  { name: 'headline', orderId: 5 },
  { name: 'body', orderId: 6 },
  { name: 'status', orderId: 2 },
  { name: 'target_id', orderId: 9 },
  { name: 'target_group', orderId: 10 },
  { name: 'room_id', orderId: 11 },
  { name: 'creator_id', orderId: 3 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<MessageColumns>;

// Definition of form fields for announcements
// Each field specifies its input type, validation requirements, and access role level
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

// API request configuration for announcement operations
// Defines endpoints and model names for CRUD operations
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
