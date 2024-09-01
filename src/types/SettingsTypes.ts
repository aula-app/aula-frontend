export type RoomPhases = 0 | 10 | 20 | 30 | 40;
export type SettingNamesType =
  | 'bug'
  | 'boxes'
  | 'comments'
  | 'ideas'
  | 'messages'
  | 'report'
  | 'rooms'
  | 'users'
  | 'categories';

export interface SettingsType {
  name: string;
  item: string;
  model: string;
  isChild: SettingNamesType;
  rows: SettingsRows[];
  forms: SettingForm[];
  requests: SettingRequests;
}

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
