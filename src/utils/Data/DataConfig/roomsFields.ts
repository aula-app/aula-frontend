import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';
import { RoomType } from '@/types/Scopes';

interface RoomFields extends FieldType {
  name: keyof RoomType;
}

interface RoomColumns extends ColumnSettings {
  name: keyof RoomType;
}

const columns = [
  { name: 'room_name', orderId: 5 },
  { name: 'description_public', orderId: 6 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<RoomColumns>;

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
      defaultValue: 'DI:0:0',
    },
    required: false,
    role: 50,
  },
  {
    name: 'status',
    form: inputType.status,
    required: true,
    role: 50,
  },
] as Array<RoomFields>;

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
