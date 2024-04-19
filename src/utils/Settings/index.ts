import { SettingsType } from "@/types/SettingsTypes";
import { ideasSettings } from "./ideasSettings";
import { roomsSettings } from "./roomsSettings";
import { textsSettings } from "./textsSettings";
import { usersSettings } from "./usersSettings";

const SettingsConfig = {
  ideas: ideasSettings as SettingsType,
  rooms: roomsSettings as SettingsType,
  texts: textsSettings as SettingsType,
  users: usersSettings as SettingsType,
} as const;

export { SettingsConfig as default, SettingsConfig };