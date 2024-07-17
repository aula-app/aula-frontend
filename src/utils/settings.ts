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
    isChild: 'ideas',
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

export const getRequest = (scope: SettingNamesType, type: 'id' | 'fetch' | 'get' | 'add' | 'edit' | 'delete') => {
  switch (type) {
    case 'id':
      return `${requestDefinitions[scope].model.toLowerCase()}_id`;
    case 'fetch':
      return `get${requestDefinitions[scope].model}s`;
    case 'get':
      return `get${requestDefinitions[scope].model}BaseData`;
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
