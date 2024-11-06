import { ColumnSettings, DataRequestsType, FieldType } from '@/types/SettingsTypes';
import { inputType } from '../formDefaults';
import { GroupType } from '@/types/Scopes';

interface GroupFields extends FieldType {
  name: keyof GroupType;
}

interface GroupColumns extends ColumnSettings {
  name: keyof GroupType;
}

const columns = [
  { name: 'group_name', orderId: 5 },
  { name: 'description_public', orderId: 6 },
  { name: 'created', orderId: 4 },
  { name: 'creator_id', orderId: 3 },
  { name: 'last_update', orderId: 0 },
] as Array<GroupColumns>;

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
