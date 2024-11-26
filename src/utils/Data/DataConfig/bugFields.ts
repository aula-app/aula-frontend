import { BugType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';

// Interface defining the structure of fields, extending the base FieldType
// with a specific name property that must be a key of BugType
interface BugFields extends FieldType {
  name: keyof BugType;
}

// Interface defining the structure of columns, extending ColumnSettings
// with a specific name property that must be a key of BugType
interface BugColumns extends ColumnSettings {
  name: keyof BugType;
}

// Configuration for table columns display order
// Each object defines a column with its name and order position
const columns = [
  { name: 'headline', orderId: 5 },
  { name: 'body', orderId: 6 },
  { name: 'created', orderId: 4 },
  { name: 'creator_id', orderId: 3 },
  { name: 'last_update', orderId: 0 },
] as Array<BugColumns>;

// Definition of form fields for announcements
// Each field specifies its input type, validation requirements, and access role level
const fields = [
  {
    name: 'body',
    required: true,
    form: inputType.longText,
    role: 10,
  },
] as Array<BugFields>;

// API request configuration for announcement operations
// Defines endpoints and model names for CRUD operations
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
