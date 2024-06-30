import { SettingsType } from "@/types/SettingsTypes";
import { usersSettings } from "./usersSettings";
import { roomsSettings } from "./roomsSettings";
import { boxesSettings } from "./boxesSettings";
import { ideasSettings } from "./ideasSettings";
import { commentSettings } from "./commentSettings";
import { messagesSettings } from "./messagesSettings";

const SettingsConfig = {
  users: usersSettings as SettingsType,
  rooms: roomsSettings as SettingsType,
  boxes: boxesSettings as SettingsType,
  ideas: ideasSettings as SettingsType,
  comments: commentSettings as SettingsType,
  messages: messagesSettings as SettingsType,
} as const;

export { SettingsConfig as default, SettingsConfig };