// Import necessary types for announcements, column settings, and form input configurations
import { IdeaType } from '@/types/Scopes';
import { inputType } from '../formDefaults';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';

// Interface defining the structure of fields, extending the base FieldType
// with a specific name property that must be a key of IdeaType
interface IdeaFields extends FieldType {
  name: keyof IdeaType;
}

// Interface defining the structure of columns, extending ColumnSettings
// with a specific name property that must be a key of IdeaType
interface IdeaColumns extends ColumnSettings {
  name: keyof IdeaType;
}

// Configuration for table columns display order
// Each object defines a column with its name and order position
const columns = [
  { name: 'title', orderId: 5 },
  { name: 'content', orderId: 6 },
  { name: 'custom_field1_name', orderId: 11 },
  { name: 'custom_field2_name', orderId: 12 },
  { name: 'user_id', orderId: 8 },
  { name: 'room_id', orderId: 7 },
  { name: 'approved', orderId: 13 },
  { name: 'approval_comment', orderId: 14 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<IdeaColumns>;

// Definition of form fields for announcements
// Each field specifies its input type, validation requirements, and access role level
const fields = [
  {
    name: 'title',
    form: inputType.shortText,
    required: true,
    role: 20,
  },
  {
    name: 'content',
    form: inputType.longText,
    required: true,
    role: 20,
  },
  {
    name: ['custom_field1', 'custom_field2'],
    form: inputType.custom,
    required: false,
    role: 30,
  },
  {
    name: 'approval_comment',
    form: inputType.longText,
    required: false,
    role: 50,
    phase: 20,
  },
  {
    name: 'approved',
    form: {
      ...inputType.select,
      options: [
        { label: '-', value: 0 },
        { label: 'generics.no', value: -1 },
        { label: 'generics.yes', value: 1 },
      ],
    },
    required: false,
    role: 50,
    phase: 20,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<IdeaFields>;

// API request configuration for announcement operations
// Defines endpoints and model names for CRUD operations
const requests = {
  name: 'ideas',
  model: 'Idea',
  item: 'Idea',
  items: 'Ideas',
  id: 'idea_id',
  fetch: 'getIdeas',
  get: 'getIdeaBaseData',
  add: 'addIdea',
  edit: 'editIdea',
  delete: 'deleteIdea',
} as DataRequestsType;

export default { fields, columns, requests };
