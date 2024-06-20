export type SettingNamesType = 'boxes' | 'ideas' | 'rooms' | 'texts' | 'users';

export interface SettingsType {
  name: string;
  item: string;
  model: string;
  rows: SettingsRows[];
  forms: SettingForm[];
  requests: SettingRequests;
}

export interface SettingsRows {
  id: number;
  name: string;
  displayName: string;
}

export interface SettingForm {
  type: 'input' | 'text' | 'select' | 'multiple';
  label: string;
  column: string;
  value?: string;
  fetchOptions?: SettingNamesType;
  options?: {label: string, value: number}[];
  required: boolean;
  hidden: boolean;
  schema: any;
}

export interface SettingRequests {
  id: string;
  fetch: string;
  get: string;
  add: string;
  edit: string;
  delete: string;
}
