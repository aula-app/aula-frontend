import { SettingNamesType } from "./scopes/SettingsTypes";

// Helper to read object's properties as obj['name']
export type ObjectPropByName = Record<string, any>;

export interface SingleResponseType {
  success: Boolean;
  count: Number;
  data: ObjectPropByName;
}

export type ColorTypes = "secondary" | "warning" | "error" | "inherit" | "primary" | "success" | "info";

export type AlterTypes = 'add' | 'edit' | 'report' | 'bug';
export interface EditDataType {
  type: AlterTypes;
  element: SettingNamesType;
  id?: number;
}