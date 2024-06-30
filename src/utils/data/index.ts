import { SettingsType } from "@/types/scopes/SettingsTypes";
import { usersSettings } from "./usersSettings";
import { roomsSettings } from "./roomsSettings";
import { boxesSettings } from "./boxesSettings";
import { ideasSettings } from "./ideasSettings";
import { commentSettings } from "./commentSettings";
import { messagesSettings } from "./messagesSettings";
import { reportSettings } from "./reportSettings";
import { bugSettings } from "./bugSettings";


const SettingsConfig = {
  users: usersSettings as SettingsType,
  rooms: roomsSettings as SettingsType,
  boxes: boxesSettings as SettingsType,
  ideas: ideasSettings as SettingsType,
  comments: commentSettings as SettingsType,
  messages: messagesSettings as SettingsType,
  report: reportSettings as SettingsType,
  bug: bugSettings as SettingsType,
} as const;

export { SettingsConfig as default, SettingsConfig };