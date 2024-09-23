import { InputType } from '@/utils/Data/formDefaults';
import { PossibleFields } from './Scopes';

export type RoomPhases = 0 | 10 | 20 | 30 | 40;
export type RoleTypes = 10 | 20 | 30 | 40 | 50 | 60;
export type SettingNamesType =
  | 'announcements'
  | 'bug'
  | 'boxes'
  | 'comments'
  | 'groups'
  | 'ideas'
  | 'messages'
  | 'report'
  | 'rooms'
  | 'users'
  | 'categories';

export interface SettingsRows {
  id: number;
  name: string;
}

export interface SettingForm {
  type: 'input' | 'text' | 'select' | 'multiple';
  name: string;
  value?: string;
  fetchOptions?: SettingNamesType;
  options?: { label: string; value: number }[];
  required: boolean;
  hidden: boolean;
  phase?: number;
  schema: any;
}

export interface SettingRequests {
  id: string;
  fetch: string;
  get: string;
  add: string;
  edit: string;
  delete: string;
  move?: string;
}

export type ColumnSettings = {
  name: keyof PossibleFields;
  orderId: number;
};

export type FieldType = {
  name: keyof PossibleFields | Array<keyof PossibleFields>;
  form: InputType;
  required: boolean;
  role: RoleTypes;
  phase?: RoomPhases;
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
