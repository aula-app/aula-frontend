export type RoomPhases = 0 | 10 | 20 | 30 | 40;
export type PhaseType = 'wild' | 'discussion' | 'approval' | 'voting' | 'results';

/*
 * 10 => "guest",
 * 20 => "user",
 * 30 => "moderator",
 * 31 => "moderator_v",
 * 40 => "super_moderator",
 * 41 => "super_moderator_v",
 * 44 => "principal",
 * 45 => "principal_v",
 * 50 => "admin",
 * 60 => "tech_admin"
 */
export type RoleTypes = 10 | 20 | 30 | 31 | 40 | 41 | 44 | 45 | 50 | 60;

export type SettingNamesType =
  | 'announcements'
  | 'bugs'
  | 'boxes'
  | 'comments'
  | 'groups'
  | 'ideas'
  | 'messages'
  | 'reports'
  | 'requests'
  | 'rooms'
  | 'surveys'
  | 'users'
  | 'categories';

export type SelectOptionType = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

interface UserOptionType extends SelectOptionType {
  displayname: string;
}

export type SelectOptionsType = Array<SelectOptionType>;
export type UserOptionsType = Array<UserOptionType>;

export type UpdateType = {
  add: string[];
  remove: string[];
  update?: string[];
};

export type UpdtesObject = { add: string[]; remove: string[] };
