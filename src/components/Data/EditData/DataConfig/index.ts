import { SettingNamesType } from '@/types/SettingsTypes';
import boxesFields from './definitions/boxesFields';
import bugFields from './definitions/bugFields';
import categoriesFields from './definitions/categoriesFields';
import commentsFields from './definitions/commentsFields';
import ideasFields from './definitions/ideasFields';
import messagesFields from './definitions/messagesFields';
import reportFields from './definitions/reportFields';
import roomsFields from './definitions/roomsFields';
import usersFields from './definitions/usersFields';
import { inputType } from './formDefaults';
import { PossibleFields } from '@/types/Scopes';
import announcementsFields from './definitions/announcementsFields';

export type InputSettings = {
  name: keyof PossibleFields;
  form: inputType;
  required: boolean;
  role: 10 | 20 | 30 | 40 | 50 | 60;
  phase?: 0 | 10 | 20 | 30 | 40;
};

const DataConfig = {
  announcements: announcementsFields,
  boxes: boxesFields,
  bug: bugFields,
  categories: categoriesFields,
  comments: commentsFields,
  ideas: ideasFields,
  messages: messagesFields,
  report: reportFields,
  rooms: roomsFields,
  users: usersFields,
} as Record<SettingNamesType, Array<InputSettings>>;

export { DataConfig as default, DataConfig };
