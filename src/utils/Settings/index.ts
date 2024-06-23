import { SettingsType } from "@/types/SettingsTypes";
import { boxesSettings } from "./boxesSettings";
import { ideasSettings } from "./ideasSettings";
import { roomsSettings } from "./roomsSettings";
import { usersSettings } from "./usersSettings";
import { messagesSettings } from "./messagesSettings";

const SettingsConfig = {
  boxes: boxesSettings as SettingsType,
  ideas: ideasSettings as SettingsType,
  rooms: roomsSettings as SettingsType,
  users: usersSettings as SettingsType,
  messages: messagesSettings as SettingsType,
} as const;

export { SettingsConfig as default, SettingsConfig };