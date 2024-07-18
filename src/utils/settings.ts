import { SettingNamesType } from '@/types/scopes/SettingsTypes';
import { formsSettings } from './formsSettings';

export const dataSettings = {
  boxes: ['name', 'description_public', 'room_id', 'phase_id'],
  bug: ['path', 'description'],
  comments: ['content'],
  ideas: ['title', 'content', 'room_id'],
  messages: ['headline', 'body', 'user_needs_to_consent', 'consent_text', 'status'],
  report: ['path', 'description'],
  rooms: ['room_name', 'description_public'],
  users: ['displayname', 'realname', 'email', 'about_me', 'username'],
} as Record<SettingNamesType, Array<keyof typeof formsSettings>>;

export const dataOrderId = {
  boxes: [1, 7, 6, 5],
  bug: [1, 2],
  comments: [5],
  ideas: [9, 7, 8],
  messages: [5, 6, 7, 8, 0],
  report: [1, 2],
  rooms: [0, 5],
  users: [6, 1, 7, 12, 5],
} as Record<SettingNamesType, Array<number>>;

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
  type: 'add' | 'delete' | 'edit' | 'fetch' | 'get' | 'id' | 'move'
) => {
  switch (type) {
    case 'id':
      return `${requestDefinitions[scope].model.toLowerCase()}_id`;
    case 'fetch':
      return `get${requestDefinitions[scope].model}s`;
    case 'get':
      return `get${requestDefinitions[scope].model}BaseData`;
    case 'move':
      return `add${requestDefinitions[scope].model}To${requestDefinitions[requestDefinitions[scope].isChild].model}`;
    default:
      return `${type}${requestDefinitions[scope].model}`;
  }
};

/*
10 => reading only, can report and bugs
20 => comment, create ideas, like
30 => edit comments and Ideas, delete within it´s own rooms
40 => same thing, but in all rooms
50 => Create rooms and users, edit roles, reports
60 => System changes, restore backups, bug repors
*/
