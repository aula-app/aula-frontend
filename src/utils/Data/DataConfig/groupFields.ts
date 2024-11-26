// Import necessary types for announcements, column settings, and form input configurations
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';
import { GroupType } from '@/types/Scopes';

// Interface defining the structure of fields, extending the base FieldType
// with a specific name property that must be a key of GroupType
interface GroupFields extends FieldType {
  name: keyof GroupType;
}

// Interface defining the structure of columns, extending ColumnSettings
// with a specific name property that must be a key of GroupType
interface GroupColumns extends ColumnSettings {
  name: keyof GroupType;
}

// Configuration for table columns display order
// Each object defines a column with its name and order position
const columns = [
  { name: 'group_name', orderId: 5 },
  { name: 'description_public', orderId: 6 },
  { name: 'created', orderId: 4 },
  { name: 'creator_id', orderId: 3 },
  { name: 'last_update', orderId: 0 },
] as Array<GroupColumns>;

// Definition of form fields for announcements
// Each field specifies its input type, validation requirements, and access role level
const fields = [
  {
    name: 'group_name',
    form: inputType.shortText,
    required: true,
    role: 30,
  },
  {
    name: 'description_public',
    form: inputType.longText,
    required: false,
    role: 30,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<GroupFields>;

// API request configuration for announcement operations
// Defines endpoints and model names for CRUD operations
const requests = {
  name: 'groups',
  model: 'Group',
  item: 'Group',
  items: 'Groups',
  id: 'group_id',
  fetch: 'getGroups',
  get: 'getGroupBaseData',
  add: 'addGroup',
  edit: 'editGroup',
  delete: 'deleteGroup',
  move: {
    model: 'User',
    get: 'getUsersByGroup',
    add: 'addUserToGroup',
    remove: 'removeUserFromGroup',
    target: 'users',
    targetId: 'user_id',
  },
} as DataRequestsType;

export default { fields, columns, requests };
