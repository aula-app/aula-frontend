import { RoomPhases } from '../../src/types/SettingsTypes';
import * as userFixtures from './users';

export type IdeaData = {
  name: string;
  description: string;
  box?: string;
  category?: string;
};

export type BoxData = {
  name: string;
  description: string;
  phase: RoomPhases;
  ideas: IdeaData[];
  discussionDays: number;
  votingDays: number;
};
