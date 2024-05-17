export type SettingNamesType = 'boxes' | 'ideas' | 'rooms' | 'texts' | 'users';

export interface SettingsType {
  definitions: SettingsDefinitions;
  requests: SettingRequests;
  forms: SettingForm[];
  rows: SettingsRows[];
}

export interface SettingsDefinitions {
  name: string;
  itemName: string;
  generates?: SettingNamesType;
}

export interface SettingRequests {
  model: string;
  method: string;
  id: string;
  get: string;
  add: string;
  edit: string;
  delete: string;
  decrypt: string[];
}

export interface SettingForm {
  name: string;
  label: string;
  defaultValue: string;
  required: boolean;
  hidden: boolean;
  isText: boolean;
  schema: any;
}

export interface SettingsRows {
  id: number;
  name: string;
  displayName: string;
  encryption: boolean;
}
