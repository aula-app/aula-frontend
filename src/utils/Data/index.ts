import { SettingNamesType } from '@/types/SettingsTypes';
import boxesFields from './DataConfig/boxesFields';
import bugFields from './DataConfig/bugFields';
import categoriesFields from './DataConfig/categoriesFields';
import commentsFields from './DataConfig/commentsFields';
import ideasFields from './DataConfig/ideasFields';
import messagesFields from './DataConfig/messagesFields';
import reportFields from './DataConfig/reportFields';
import roomsFields from './DataConfig/roomsFields';
import usersFields from './DataConfig/usersFields';
import { PossibleFields } from '@/types/Scopes';
import announcementsFields from './DataConfig/announcementsFields';
import groupFields from './DataConfig/groupFields';
import { InputType } from './formDefaults';

export type InputSettings = {
  name: keyof PossibleFields;
  form: InputType;
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
  groups: groupFields,
  ideas: ideasFields,
  messages: messagesFields,
  report: reportFields,
  rooms: roomsFields,
  users: usersFields,
};

export { DataConfig as default, DataConfig };
