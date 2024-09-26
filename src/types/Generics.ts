import { PossibleFields } from './Scopes';
import { RoleTypes, SettingNamesType } from './SettingsTypes';

// Helper to read object's properties as obj['name']
export type ObjectPropByName = Record<string, any>;
export type DatabaseResponseData = PossibleFields;

export interface SingleResponseType {
  success: boolean;
  count: number;
  data: DatabaseResponseData;
}

export interface DatabaseResponseType {
  success: boolean;
  count: number;
  data: DatabaseResponseData[];
}

export type ColorTypes = 'secondary' | 'warning' | 'error' | 'inherit' | 'primary' | 'success' | 'info';
export type AlterTypes = 'add' | 'edit' | 'delete' | 'report' | 'bug';
export type StatusTypes = -1 | 0 | 1 | 2 | 3;

export interface EditDataType {
  type: AlterTypes;
  element: SettingNamesType;
  onClose: () => void;
  id?: number;
}

export interface DefaultUpdate {
  id: number;
  idea_id: number;
  topic_id: number | null;
  phase_id: number | null;
  room_id: number;
  title: string;
}

export type PassResponse = {
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
};

export type ConfigResponse = {
  allow_registration: 0 | 1;
  archive_after: null;
  base_url: string;
  daily_end_time: Date;
  date_format: number;
  default_email_address: string;
  default_role_for_registration: RoleTypes;
  description_public: string;
  enable_oauth: 0 | 1;
  external_hash_id: null;
  first_workday_week: number;
  id: number;
  internal_hash_id: null;
  last_update: Date;
  last_workday_week: number;
  media_url: null;
  name: string;
  organisation_type: number;
  preferred_language: number;
  start_time: Date;
  time_format: number;
  updater_id: number;
};

export type InstanceResponse = {
  created: Date;
  id: number;
  last_update: Date;
  online_mode: OnlineOptions;
  revert_to_on_active: 0 | 1;
  revert_to_on_date: Date;
  updater_id: number;
};

export type OnlineOptions = 0 | 1 | 2 | 3 | 4;
