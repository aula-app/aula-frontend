import { AnnouncementType } from '@/types/Scopes';
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';

// Interface defining the structure of fields, extending the base FieldType
// with a specific name property that must be a key of AnnouncementType
interface AnnouncementFields extends FieldType {
  name: keyof AnnouncementType;
}

// Interface defining the structure of columns, extending ColumnSettings
// with a specific name property that must be a key of AnnouncementType
interface AnnouncementColumns extends ColumnSettings {
  name: keyof AnnouncementType;
}

// Configuration for table columns display order
// Each object defines a column with its name and order position
const columns = [
  { name: 'headline', orderId: 5 },
  { name: 'body', orderId: 6 },
  { name: 'user_needs_to_consent', orderId: 8 },
  { name: 'creator_id', orderId: 3 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<AnnouncementColumns>;

// Definition of form fields for announcements
// Each field specifies its input type, validation requirements, and access role level
const fields = [
  {
    name: 'headline', // Title field for the announcement
    form: inputType.shortText, // Single-line text input
    required: true,
    role: 50, // Minimum role level required to access
  },
  {
    name: 'body', // Main content of the announcement
    form: inputType.longText, // Multi-line text input
    required: true,
    role: 50,
  },
  {
    name: 'user_needs_to_consent', // User consent requirement setting
    form: {
      ...inputType.select, // Dropdown selection with predefined options
      options: [
        { label: 'consent.message', value: 0 }, // No consent required
        { label: 'consent.announcement', value: 1 }, // Optional consent
        { label: 'consent.alert', value: 2 }, // Mandatory consent
      ],
    },
    required: true,
    role: 50,
  },
  {
    name: 'consent_text', // Text displayed for consent
    form: inputType.shortText,
    required: true,
    role: 50,
  },
  {
    name: 'status', // Announcement status
    form: inputType.status, // Status selection input
    required: true,
    role: 50,
  },
] as Array<AnnouncementFields>;

// API request configuration for announcement operations
// Defines endpoints and model names for CRUD operations
const requests = {
  name: 'announcements', // Resource name
  model: 'Text', // Model name in the backend
  item: 'Text', // Single item reference
  items: 'Texts', // Multiple items reference
  id: 'text_id', // Primary key field name
  fetch: 'getTexts', // List all announcements
  get: 'getTextBaseData', // Get single announcement
  add: 'addText', // Create new announcement
  edit: 'editText', // Update existing announcement
  delete: 'deleteText', // Delete announcement
} as DataRequestsType;

export default { fields, columns, requests };
