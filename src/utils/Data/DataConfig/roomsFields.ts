// Import necessary types for announcements, column settings, and form input configurations
import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';
import { RoomType } from '@/types/Scopes';

// Interface defining the structure of fields, extending the base FieldType
// with a specific name property that must be a key of RoomType
interface RoomFields extends FieldType {
  name: keyof RoomType;
}

// Interface defining the structure of columns, extending the base ColumnSettings
// with a specific name property that must be a key of RoomType
interface RoomColumns extends ColumnSettings {
  name: keyof RoomType;
}

// Configuration for table columns display order
// Each object defines a column with its name and order position
const columns = [
  { name: 'room_name', orderId: 5 },
  { name: 'description_public', orderId: 6 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<RoomColumns>;

// Definition of form fields for announcements
// Each field specifies its input type, validation requirements, and access role level
const fields = [
  {
    name: 'room_name',
    form: inputType.shortText,
    required: true,
    role: 50,
  },
  {
    name: 'description_public',
    form: inputType.longText,
    required: false,
    role: 50,
  },
  {
    name: 'description_internal',
    form: {
      type: 'image',
      defaultValue: '',
    },
    required: false,
    role: 50,
  },
  {
    name: ['phase_duration_1', 'phase_duration_2', 'phase_duration_3', 'phase_duration_4'],
    form: inputType.duration,
    required: true,
    role: 30,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<RoomFields>;

// API request configuration for announcement operations
// Defines endpoints and model names for CRUD operations
const requests = {
  name: 'rooms',
  model: 'Room',
  item: 'Room',
  items: 'Rooms',
  id: 'room_id',
  fetch: 'getRooms',
  get: 'getRoomBaseData',
  add: 'addRoom',
  edit: 'editRoom',
  delete: 'deleteRoom',
  move: {
    model: 'User',
    add: 'addUserToRoom',
    remove: 'removeUserFromRoom',
    get: 'getUsersByRoom',
    target: 'users',
    targetId: 'user_id',
  },
} as DataRequestsType;

export default { fields, columns, requests };
