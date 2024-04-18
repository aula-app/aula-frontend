import { ideasSettings } from "./ideasSettings";
import { roomsSettings } from "./roomsSettings";
import { textsSettings } from "./textsSettings";
import { usersSettings } from "./usersSettings";

const SettingsConfig = {
  ideas: ideasSettings,
  rooms: roomsSettings,
  texts: textsSettings,
  users: usersSettings,
};

export { SettingsConfig as default, SettingsConfig };