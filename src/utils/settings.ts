import { SettingNamesType } from '@/types/SettingsTypes';
import { PossibleFields } from '@/types/Scopes';

type DataSetting = {
  name: keyof PossibleFields;
  orderId: number;
  role: 10 | 20 | 30 | 40 | 50 | 60;
};

/* ROLE DEFINITIONS
10 => reading only, can report and bugs
20 => comment, create ideas, like
30 => edit comments and Ideas, delete within it´s own rooms
40 => same thing, but in all rooms
50 => Create rooms and users, edit roles, reports
60 => System changes, restore backups, bug repors
*/

export const dataSettings = {
  boxes: [
    { name: 'name', orderId: 1, role: 50 },
    { name: 'description_public', orderId: 7, role: 50 },
    { name: 'room_id', orderId: 6, role: 50 },
    { name: 'phase_id', orderId: 5, role: 50 },
    { name: 'phase_duration_1', orderId: 5, role: 50 },
    { name: 'phase_duration_2', orderId: 5, role: 50 },
    { name: 'phase_duration_3', orderId: 5, role: 50 },
    { name: 'phase_duration_4', orderId: 5, role: 50 },
  ],
  bug: [
    { name: 'path', orderId: 1, role: 10 },
    { name: 'description', orderId: 2, role: 10 },
  ],
  comments: [{ name: 'content', orderId: 5, role: 20 }],
  ideas: [
    { name: 'title', orderId: 9, role: 20 },
    { name: 'content', orderId: 7, role: 20 },
    { name: 'room_id', orderId: 8, role: 50 },
  ],
  messages: [
    { name: 'headline', orderId: 5, role: 50 },
    { name: 'body', orderId: 6, role: 50 },
    { name: 'user_needs_to_consent', orderId: 7, role: 50 },
    { name: 'consent_text', orderId: 8, role: 50 },
    { name: 'status', orderId: 0, role: 50 },
  ],
  report: [
    { name: 'path', orderId: 1, role: 10 },
    { name: 'description', orderId: 2, role: 10 },
  ],
  rooms: [
    { name: 'room_name', orderId: 0, role: 50 },
    { name: 'description_public', orderId: 5, role: 50 },
  ],
  users: [
    { name: 'displayname', orderId: 6, role: 20 },
    { name: 'realname', orderId: 1, role: 20 },
    { name: 'email', orderId: 7, role: 20 },
    { name: 'about_me', orderId: 12, role: 20 },
    { name: 'username', orderId: 5, role: 50 },
  ],
} as Record<SettingNamesType, Array<DataSetting>>;

export const requestDefinitions = {
  boxes: {
    model: 'Topic',
    isChild: 'rooms',
  },
  bug: {
    model: '',
  },
  comments: {
    model: 'Comment',
  },
  ideas: {
    model: 'Idea',
    isChild: 'boxes',
  },
  messages: {
    model: 'Text',
  },
  report: {
    model: '',
  },
  rooms: {
    model: 'Room',
  },
  users: {
    model: 'User',
    isChild: 'rooms',
  },
} as Record<SettingNamesType, { model: string; isChild: SettingNamesType }>;

export const getRequest = (
  scope: SettingNamesType,
  type: 'add' | 'delete' | 'edit' | 'fetch' | 'get' | 'getChild' | 'id' | 'move'
) => {
  switch (type) {
    case 'id':
      return `${requestDefinitions[scope].model.toLowerCase()}_id`;
    case 'fetch':
      return `get${requestDefinitions[scope].model}s`;
    case 'get':
      return `get${requestDefinitions[scope].model}BaseData`;
    case 'getChild':
      return `get${requestDefinitions[scope].model}sBy${requestDefinitions[requestDefinitions[scope].isChild].model}`;
    case 'move':
      return `add${requestDefinitions[scope].model}To${requestDefinitions[requestDefinitions[scope].isChild].model}`;
    default:
      return `${type}${requestDefinitions[scope].model}`;
  }
};
