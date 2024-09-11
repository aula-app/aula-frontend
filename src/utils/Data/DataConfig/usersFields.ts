import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';
import { UserType } from '@/types/Scopes';

interface UserFields extends FieldType {
  name: keyof UserType;
}

interface UserColumns extends ColumnSettings {
  name: keyof UserType;
}

const columns = [
  { name: 'displayname', orderId: 5 },
  { name: 'realname', orderId: 6 },
  { name: 'username', orderId: 7 },
  { name: 'email', orderId: 8 },
  { name: 'about_me', orderId: 10 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<UserColumns>;

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
    form: inputType.shortText,
    required: true,
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
      ...inputType.select,
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
