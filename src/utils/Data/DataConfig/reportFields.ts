// Import necessary types for announcements, column settings, and form input configurations
import { ReportType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';

// Interface defining the structure of fields, extending the base FieldType
// with a specific name property that must be a key of ReportType
interface ReportFields extends FieldType {
  name: keyof ReportType;
}

// Interface defining the structure of columns, extending the base ColumnSettings
// with a specific name property that must be a key of ReportType
interface ReportColumns extends ColumnSettings {
  name: keyof ReportType;
}

// Configuration for table columns display order
// Each object defines a column with its name and order position
const columns = [
  { name: 'headline', orderId: 5 },
  { name: 'body', orderId: 6 },
  { name: 'created', orderId: 4 },
  { name: 'status', orderId: 2 },
  { name: 'creator_id', orderId: 3 },
  { name: 'last_update', orderId: 0 },
] as Array<ReportColumns>;

// Definition of form fields for announcements
// Each field specifies its input type, validation requirements, and access role level
const fields = [
  {
    name: 'body',
    form: inputType.longText,
    required: true,
    role: 10,
  },
] as Array<ReportFields>;

// API request configuration for announcement operations
// Defines endpoints and model names for CRUD operations
const requests = {
  name: 'report',
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
