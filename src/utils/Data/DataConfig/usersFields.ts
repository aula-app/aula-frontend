// Import necessary types for announcements, column settings, and form input configurations
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';
import { UserType } from '@/types/Scopes';

// Interface defining the structure of fields, extending the base FieldType
// with a specific name property that must be a key of UserType
interface UserFields extends FieldType {
  name: keyof UserType;
}

// Interface defining the structure of columns, extending the base ColumnSettings
// with a specific name property that must be a key of UserType
interface UserColumns extends ColumnSettings {
  name: keyof UserType;
}

// Configuration for table columns display order
// Each object defines a column with its name and order position
const columns = [
  { name: 'displayname', orderId: 5 },
  { name: 'realname', orderId: 6 },
  { name: 'username', orderId: 7 },
  { name: 'email', orderId: 8 },
  { name: 'userlevel', orderId: 9 },
  { name: 'temp_pw', orderId: 11 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<UserColumns>;

// Definition of form fields for announcements
// Each field specifies its input type, validation requirements, and access role level
const fields = [
  {
    name: 'displayname',
    form: inputType.shortText,
    required: true,
    role: 20,
  },
  {
    name: 'realname',
    form: inputType.shortText,
    required: true,
    role: 20,
  },
  {
    name: 'username',
    form: inputType.shortText,
    required: true,
    role: 50,
  },
  {
    name: 'email',
    form: inputType.email,
    required: false,
    role: 20,
  },
  {
    name: 'about_me',
    form: inputType.longText,
    required: false,
    role: 20,
  },
  {
    name: 'userlevel',
    form: {
      ...inputType.select, // Dropdown selection with predefined options
      defaultValue: 20,
      options: [
        { label: 'roles.10', value: 10 },
        { label: 'roles.20', value: 20 },
        { label: 'roles.30', value: 30 },
        { label: 'roles.40', value: 40 },
        { label: 'roles.50', value: 50 },
      ],
    },
    required: true,
    role: 50,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<UserFields>;

// API request configuration for announcement operations
// Defines endpoints and model names for CRUD operations
const requests = {
  name: 'users',
  model: 'User',
  item: 'User',
  items: 'Users',
  id: 'user_id',
  fetch: 'getUsers',
  get: 'getUserBaseData',
  add: 'addUser',
  edit: 'editUser',
  delete: 'deleteUser',
  move: {
    model: 'User',
    add: 'addUserToRoom',
    remove: 'removeUserFromRoom',
    get: 'getRoomsByUser',
    target: 'rooms',
    targetId: 'room_id',
  },
} as DataRequestsType;

export default { fields, columns, requests };
