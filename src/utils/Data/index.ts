import announcementsFields from './DataConfig/announcementsFields';
import boxesFields from './DataConfig/boxesFields';
import bugFields from './DataConfig/bugFields';
import categoriesFields from './DataConfig/categoriesFields';
import commentsFields from './DataConfig/commentsFields';
import groupFields from './DataConfig/groupFields';
import ideasFields from './DataConfig/ideasFields';
import messagesFields from './DataConfig/messagesFields';
import reportFields from './DataConfig/reportFields';
import roomsFields from './DataConfig/roomsFields';
import suveysFields from './DataConfig/suveysFields';
import usersFields from './DataConfig/usersFields';

const DataConfig = {
  announcements: announcementsFields,
  boxes: boxesFields,
  bug: bugFields,
  categories: categoriesFields,
  comments: commentsFields,
  groups: groupFields,
  ideas: ideasFields,
  messages: messagesFields,
  reports: reportFields,
  rooms: roomsFields,
  surveys: suveysFields,
  users: usersFields,
};

export { DataConfig, DataConfig as default };
