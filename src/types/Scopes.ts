import { CategoryIconType } from '@/components/AppIcon/AppIcon';
import { RoleTypes, RoomPhases } from './SettingsTypes';
import { StatusTypes } from './Generics';

export interface AnnouncementType {
  id: number;
  hash_id: string;
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
  status: StatusTypes;
}

export interface BoxType {
  id: number;
  hash_id: string;
  name: string;
  description_public: string;
  description_internal: string;
  ideas_num: number;
  created: string;
  last_update: string;
  updater_id: number;
  room_id: number;
  room_hash_id: string;
  phase_id: `${RoomPhases}`;
  phase_duration_0: number;
  phase_duration_1: number;
  phase_duration_2: number;
  phase_duration_3: number;
  phase_duration_4: number;
  status: StatusTypes;
}


export interface CommentType {
  id: number;
  hash_id: string;
  content: string;
  username: string;
  displayname: string;
  sum_likes: number;
  idea_id: number;
  user_id: number;
  user_hash_id: string;
  language_id: number;
  parent_id: number;
  status: StatusTypes;
  created: string;
  last_update: string;
  updater_id: number;
}

export interface GroupType {
  id: number;
  group_name: string;
  description_public: string;
  description_internal: string;
  status: StatusTypes;
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
  hash_id: string;
  user_id: number;
  user_hash_id: string;
  content: string;
  title: string;
  displayname: string;
  created: string;
  last_updated: string;
  sum_likes: number;
  sum_votes: number;
  sum_comments: number;
  room_id: number;
  room_hash_id: string;
  status: StatusTypes;
  is_winner: number;
  winner_comment: string;
  approved: -1 | 0 | 1;
  approval_comment: null;
  custom_field1: string | null;
  custom_field2: string | null;
  number_of_votes: number;
  number_of_users: number;
  phase_id: `${RoomPhases}`;
}

export interface MessageType {
  id: number;
  hash_id: string;
  user_hash_id: string;
  creator_id: number;
  headline: string;
  body: string;
  language_id: number;
  location: null;
  publish_date: string;
  created: string;
  last_update: string;
  updater_id: number;
  status: StatusTypes;
  target_group: number | null;
  target_id: string | null;
  only_on_dashboard: number;
  level_of_detail: number;
  msg_type: number;
  room_id: number;
  pin_to_top: number;
}


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
  phase_duration_0: number;
  phase_duration_1: number;
  phase_duration_2: number;
  phase_duration_3: number;
  phase_duration_4: number;
  room_name: string;
  status: StatusTypes;
  updater_id: string;
  type: 0 | 1;
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
  status: StatusTypes;
  created: string;
  last_update: string;
  updater_id: number;
  bi: string;
  userlevel: RoleTypes;
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
  roles?: string;
}

export interface CategoryType {
  name: string;
  description_public: string;
  description_internal: CategoryIconType;
  created: string;
  last_update: string;
  id: number;
  status: StatusTypes;
}

export interface CommandType {
  id: number;
  cmd_id: number;
  command: string;
  parameters: number;
  date_start: string;
  date_end: string;
  active: number;
  status: StatusTypes;
  info: string;
  target_id: number;
  creator_id: number;
  created: string;
  last_update: string;
  updater_id: number;
}

// Type for generic constraints
export type ScopeType =
  | AnnouncementType
  | BoxType
  | CommentType
  | GroupType
  | IdeaType
  | MessageType
  | RoomType
  | UserType
  | CategoryType
  | CommandType;


export type SettingType = AnnouncementType | BoxType | IdeaType | MessageType | RoomType | UserType;
export type SettingsType = AnnouncementType[] | BoxType[] | IdeaType[] | MessageType[] | RoomType[] | UserType[];

// Common fields that can be used in forms
export type CommonFormFields = 'id' | 'created';

// Type for form data
export type PossibleFields = Record<string, string>;








export interface DelegationType {
  user_id_original: string;
  user_id_target: string;
  room_id: string;
  topic_id: string;
  status: StatusTypes;
  updater_id: number;
  created: string;
  last_update: string;
  delegate_hash_id: string;
  delegate_realname: string;
  delegate_displayname: string;
}
