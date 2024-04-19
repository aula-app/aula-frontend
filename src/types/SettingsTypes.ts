export type SettingNamesType = "ideas" | "rooms" | "texts" | "users";
export interface SettingsType {
  requests: SettingRequests
  forms: SettingForm[]
}
export interface SettingForm {
  name: string;
  label: string;
  defaultValue: string;
  required: boolean,
  hidden: boolean;
  isText: boolean;
  schema: any;
}
export interface SettingRequests {
    model: string,
    get: string,
    add: string,
    edit: string,
    delete: string,
    decrypt: string[],
}

