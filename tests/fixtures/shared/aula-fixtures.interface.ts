import { Page } from "@playwright/test";
import { RoomData, UserData } from "../../support/types";
import { RoleTypes } from "../../../src/types/SettingsTypes";

export interface AulaFixtures {
  adminPage: Page;
  // newPage: (userData: UserData) => Promise<Page>;
  ensureUser: (name: string, role: RoleTypes) => Promise<UserData>;
  ensureRoom: (name: string, users: { username: string }[]) => Promise<RoomData>;
  newPage: (username: string, role: RoleTypes) => Promise<Page>;

  init<K extends readonly (keyof UserFixtures)[]>(include?: K): Promise<{ [P in K[number]]: UserFixtures[P] }>;
  initAndUserPage: Page;
  initAndAllPages: () => Promise<{ userConfig: UserData, studentConfig: UserData, userPage: Page, studentPage: Page, adminPage: Page }>;
}

export interface UserFixtures {
  studentConfig: UserData;
  userConfig: UserData;
  studentPage: Page;
  userPage: Page;
  room: RoomData;
}

export class TestFixtures {
  studentConfig?: UserData;
  userConfig?: UserData;
  studentPage?: Page;
  userPage?: Page;
  room?: RoomData;
}

export interface TestFixturesParamOfUser { username: string; userlevel: RoleTypes }
export interface TestFixturesParamOfRoom { name: string; users: { username: string }[] }
export class TestFixturesParams {
  studentConfig?: TestFixturesParamOfUser = { username: 'student', userlevel: 20 };
  studentPage?: TestFixturesParamOfUser = { username: 'student', userlevel: 20 };
  userConfig?: TestFixturesParamOfUser = { username: 'user', userlevel: 20 };
  userPage?: TestFixturesParamOfUser = { username: 'user', userlevel: 20 };
  room?: TestFixturesParamOfRoom;
}


