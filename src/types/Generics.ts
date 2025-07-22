import { RoleTypes } from './SettingsTypes';

// Helper to read object's properties as obj['name']
export type ObjectPropByName = Record<string, any>;

export type StatusTypes = -1 | 0 | 1 | 2 | 3;

export interface DefaultUpdate {
  id: string;
  idea_id: string;
  topic_id: string | null;
  phase_id: string | null;
  room_id: string;
  title: string;
}

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

export type OnlineOptions = 0 | 1 | 2 | 3 | 4 | 5;
