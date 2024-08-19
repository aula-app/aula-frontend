import { SettingNamesType } from '@/types/SettingsTypes';
import { PossibleFields } from '@/types/Scopes';

type DataSetting = {
  name: keyof PossibleFields;
  orderId: number;
  role: 10 | 20 | 30 | 40 | 50 | 60;
  phase?: 0 | 10 | 20 | 30 | 40;
};

/* ROLE DEFINITIONS
10 => Guest: reading only, can report and bugs
20 => User: comment, create ideas, like
30 => Moderator: edit comments and Ideas, delete within it´s own rooms
40 => Super Moderator: same thing, but in all rooms
50 => Admin: Create rooms and users, edit roles, reports
60 => System Admin: System changes, restore backups, bug repors
*/

export const dataSettings = {
  boxes: [
    { name: 'name', orderId: 1, role: 30 },
    { name: 'description_public', orderId: 7, role: 30 },
    { name: 'room_id', orderId: 6, role: 30 },
    { name: 'phase_id', orderId: 5, role: 30 },
    { name: 'phase_duration_1', orderId: -1, role: 30 },
    { name: 'phase_duration_2', orderId: -1, role: 30 },
    { name: 'phase_duration_3', orderId: -1, role: 30 },
    { name: 'phase_duration_4', orderId: -1, role: 30 },
  ],
  bug: [
    { name: 'headline', orderId: 1, role: 10 },
    { name: 'body', orderId: 2, role: 10 },
  ],
  comments: [{ name: 'content', orderId: 5, role: 20 }],
  ideas: [
    { name: 'title', orderId: 9, role: 20 },
    { name: 'content', orderId: 7, role: 20 },
    { name: 'room_id', orderId: 8, role: 50 },
    { name: 'approval_comment', orderId: 10, role: 50, phase: 20 },
    { name: 'approved', orderId: 11, role: 50, phase: 20 },
  ],
  messages: [
    { name: 'headline', orderId: 5, role: 50 },
    { name: 'body', orderId: 6, role: 50 },
    { name: 'user_needs_to_consent', orderId: 7, role: 50 },
    { name: 'consent_text', orderId: 8, role: 50 },
    { name: 'status', orderId: 0, role: 50 },
  ],
  report: [
    { name: 'headline', orderId: 1, role: 10 },
    { name: 'body', orderId: 2, role: 10 },
  ],
  rooms: [
    { name: 'room_name', orderId: 0, role: 50 },
    { name: 'description_public', orderId: 5, role: 50 },
    { name: 'description_internal', orderId: -1, role: 50 },
  ],
  users: [
    { name: 'displayname', orderId: 6, role: 20 },
    { name: 'realname', orderId: 1, role: 20 },
    { name: 'username', orderId: 5, role: 50 },
    { name: 'email', orderId: 7, role: 20 },
    { name: 'about_me', orderId: 12, role: 20 },
    { name: 'userlevel', orderId: 13, role: 50 },
  ],
  categories: [
    { name: 'description_internal', orderId: -1, role: 20 },
    { name: 'name', orderId: -1, role: 20 },
  ],
} as Record<SettingNamesType, Array<DataSetting>>;

export const requestDefinitions = {
  boxes: {
    model: 'Topic',
    item: 'Topic',
    items: 'Topics',
    isChild: 'rooms',
  },
  bug: {
    model: 'Message',
    item: 'Message',
    items: 'Messages',
  },
  comments: {
    model: 'Comment',
    item: 'Comment',
    items: 'Comments',
  },
  ideas: {
    model: 'Idea',
    item: 'Idea',
    items: 'Ideas',
    isChild: 'boxes',
  },
  messages: {
    model: 'Text',
    item: 'Text',
    items: 'Texts',
  },
  report: {
    model: 'Message',
    item: 'Message',
    items: 'Messages',
  },
  rooms: {
    model: 'Room',
    item: 'Room',
    items: 'Rooms',
  },
  users: {
    model: 'User',
    item: 'User',
    items: 'Users',
    isChild: 'rooms',
  },
  categories: {
    model: 'Idea',
    item: 'Category',
    items: 'Categories',
    isChild: 'ideas',
  },
} as Record<
  SettingNamesType,
  { model: string; item: string; items: string; method?: string; isChild?: SettingNamesType }
>;

export const getRequest = (
  scope: SettingNamesType,
  type: 'add' | 'delete' | 'edit' | 'fetch' | 'get' | 'getChild' | 'id' | 'move' | 'remove'
) => {
  switch (type) {
    case 'id':
      return `${requestDefinitions[scope].item.toLowerCase()}_id`;
    case 'fetch':
      return `get${requestDefinitions[scope].items}`;
    case 'get':
      return `get${requestDefinitions[scope].item}BaseData`;
    case 'getChild':
      return requestDefinitions[scope].isChild
        ? `get${requestDefinitions[scope].item}sBy${requestDefinitions[requestDefinitions[scope].isChild].item}`
        : '';
    case 'move':
      return requestDefinitions[scope].isChild
        ? `add${requestDefinitions[scope].item}To${requestDefinitions[requestDefinitions[scope].isChild].item}`
        : '';
    case 'remove':
      return requestDefinitions[scope].isChild
        ? `remove${requestDefinitions[scope].item}From${requestDefinitions[requestDefinitions[scope].isChild].item}`
        : '';
    default:
      return `${type}${requestDefinitions[scope].item}`;
  }
};
