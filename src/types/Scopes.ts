import { CategoryIconType } from '@/components/AppIcon/AppIcon';
import { RoomPhases } from './SettingsTypes';

export interface AnnouncementType {
  id: number;
  creator_id: number;
  headline: string;
  body: string;
  user_needs_to_consent: number;
  service_id_consent: number;
  consent_text: string;
  language_id: number;
  location: null;
  created: string;
  last_update: string;
  updater_id: number;
  status: number;
}

export interface BoxType {
  id: number;
  name: string;
  description_public: string;
  ideas_num: number;
  created: string;
  last_update: string;
  updater_id: number;
  room_id: number;
  phase_id: `${RoomPhases}`;
  phase_duration_0: number;
  phase_duration_1: number;
  phase_duration_2: number;
  phase_duration_3: number;
  phase_duration_4: number;
}

export interface BugType extends MessageType {}

export interface CommentType {
  id: number;
  content: string;
  username: string;
  sum_likes: number;
  idea_id: number;
  user_id: number;
  language_id: number;
  parent_id: number;
  status: number;
  created: string;
  last_update: string;
  updater_id: number;
}

export interface GroupType {
  id: number;
  group_name: string;
  description_public: string;
  description_internal: string;
  status: number;
  internal_info: string;
  created: string;
  last_update: string;
  updater_id: number;
  hash_id: string;
  access_code: string;
  order_importance: number;
  vote_bias: number;
}

export interface IdeaType {
  id: number;
  content: string;
  title: string;
  displayname: string;
  created: string;
  last_updated: string;
  sum_likes: number;
  sum_votes: number;
  sum_comments: number;
  user_id: number;
  room_id: number;
  status: number;
  language_id: number;
  is_winner: number;
  approved: number;
  approval_comment: null;
  topic_id: number;
  custom_field1: string | null;
  custom_field2: string | null;
}

export interface MessageType {
  id: number;
  creator_id: number;
  headline: string;
  body: string;
  language_id: number;
  location: null;
  publish_date: string;
  created: string;
  last_update: string;
  updater_id: number;
  status: number;
  target_group: number;
  target_id: number;
  only_on_dashboard: number;
  level_of_detail: number;
  msg_type: number;
  room_id: number;
  pin_to_top: number;
}

export interface ReportType extends MessageType {}

export interface RoomType {
  access_code: string;
  created: string;
  description_internal: string;
  description_public: string;
  hash_id: string;
  id: number;
  internal_info: string;
  last_update: string;
  order_importance: number;
  restrict_to_roomusers_only: number;
  room_name: string;
  status: number;
  updater_id: number;
}

export interface UserType {
  id: number;
  realname: string;
  displayname: string;
  username: string;
  email: string;
  about_me: string;
  avatar?: string;
  pw: string;
  position: string;
  hash_id: string;
  registration_status: null;
  status: number;
  created: string;
  last_update: string;
  updater_id: number;
  bi: string;
  userlevel: string;
  infinite_votes: string;
  last_login: string;
  presence: string;
  absent_until: string;
  auto_delegation: number;
  trustee_id: string;
  o1: string;
  o2: string;
  o3: string;
  temp_pw: string;
  consents_given: number;
  consents_needed: number;
}

export interface CategoryType {
  name: string;
  description_public: string;
  description_internal: CategoryIconType;
  created: string;
  last_update: string;
  id: number;
}

export interface CommandType {
  id: number;
  cmd_id: number;
  command: string;
  parameters: { value: number; target?: number };
  date_start: string;
  date_end: string;
  active: number;
  status: number;
  info: string;
  target_id: number;
  creator_id: number;
  created: string;
  last_update: string;
  updater_id: number;
}

export interface PossibleFields
  extends AnnouncementType,
    BoxType,
    BugType,
    CommentType,
    CommandType,
    GroupType,
    IdeaType,
    MessageType,
    RoomType,
    UserType {}

export type UserRequestTypes = 'changeName' | 'deleteAccount' | 'exportData' | 'requestData';

export interface ReportBodyType {
  type?: UserRequestTypes;
  data?: {
    type: 'bug' | 'report';
    location: string;
    user: string;
    userAgent?: string;
  };
  content: string;
}

export interface RequestBodyType {
  type?: UserRequestTypes;
  data?: {
    id?: number;
    username?: string;
    email?: string;
    property?: 'email' | 'realname' | 'username';
    from?: string;
    to?: string;
  };
  content: string;
}
