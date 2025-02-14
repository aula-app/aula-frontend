import { PossibleFields } from './Scopes';

export type RoomPhases = 0 | 10 | 20 | 30 | 40;
export type PhaseType = 'wild' | 'discussion' | 'approval' | 'voting' | 'results';
export type RoleTypes = 10 | 20 | 30 | 40 | 50 | 60;

export type ScopeNameType = 'idea' | 'room' | 'user';

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

export type ColumnSettings = {
  name: keyof PossibleFields;
  orderId: number;
};

export type DataRequestsType = {
  name: SettingNamesType;
  model: string;
  item: string;
  items: string;
  id: string;
  fetch: string;
  get: string;
  add: string;
  edit: string;
  delete: string;
  move?: {
    target: SettingNamesType;
    targetId: string;
    model: string;
    add: string;
    remove: string;
    get: string;
  };
  check?: string;
};

export interface CustomFieldsType {
  custom_field1: string | null;
  custom_field2: string | null;
}

export interface CustomFieldsNameType {
  custom_field1_name: string | null;
  custom_field2_name: string | null;
}

export type SelectOptionType = {
  label: string;
  value: string | number;
};

export type SelectOptionsType = Array<SelectOptionType>;

export type UpdateType = {
  add: string[];
  remove: string[];
};

export type UpdateType = {
  add: string[];
  remove: string[];
};

export type UpdtesObject = { add: string[]; remove: string[] };
