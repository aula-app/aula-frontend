import * as SettingsTypes from '../../src/types/SettingsTypes';

export type BoxData = {
  name: string;
  description: string;
  phase: SettingsTypes.RoomPhases;
  ideas: IdeaData[];
  discussionDays: number;
  votingDays: number;
};

export type IdeaData = {
  name: string;
  description: string;
  box?: string;
  category?: string;
};

export type RoomData = {
  name: string;
  description: string;
  users: UserData[];
};

export type UserData = {
  username: string;
  password: string;
  displayName: string;
  realName: string;
  role: SettingsTypes.RoleTypes;
  about: string;
};
