import * as userFixtures from './users';

export type RoomData = {
  name: string;
  description: string;
  users: userFixtures.UserData[];
};
