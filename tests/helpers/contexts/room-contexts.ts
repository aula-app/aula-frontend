import * as entities from '../entities';
import * as rooms from '../../interactions/rooms';
import * as boxes from '../../interactions/boxes';
import * as ideas from '../../interactions/ideas';
import { RoomData, BoxData, IdeaData, UserData } from '../../support/types';

/**
 * Shared test contexts to avoid duplicating setup across test files
 * These functions create prerequisite entities that multiple tests need
 */

export interface RoomContext {
  room: RoomData;
  cleanup: () => Promise<void>;
}

export interface RoomWithBoxContext extends RoomContext {
  box: BoxData;
}

export interface RoomWithIdeasContext extends RoomContext {
  ideas: IdeaData[];
}

/**
 * Sets up a room with specified users
 * Returns the room and a cleanup function
 */
export async function setupRoomContext(admin: any, users: UserData[], suffix = 'shared'): Promise<RoomContext> {
  const room = entities.createRoom(suffix);
  room.users = users;

  await rooms.create(admin, room);

  return {
    room,
    cleanup: async () => {
      await rooms.remove(admin, room);
    },
  };
}

/**
 * Sets up a room with a box inside it
 * Returns the room, box, and cleanup function
 */
export async function setupRoomWithBoxContext(
  admin: any,
  users: UserData[],
  suffix = 'shared'
): Promise<RoomWithBoxContext> {
  const room = entities.createRoom(suffix);
  room.users = users;

  await rooms.create(admin, room);

  const box = entities.createBox('shared-box', room);
  await boxes.create(admin, box);

  return {
    room,
    box,
    cleanup: async () => {
      await boxes.remove(admin, box);
      await rooms.remove(admin, room);
    },
  };
}

/**
 * Sets up a room with sample ideas
 * Returns the room, ideas, and cleanup function
 */
export async function setupRoomWithIdeasContext(
  admin: any,
  userBrowser: any,
  users: UserData[],
  ideaCount = 2,
  suffix = 'shared'
): Promise<RoomWithIdeasContext> {
  const room = entities.createRoom(suffix);
  room.users = users;

  await rooms.create(admin, room);

  const createdIdeas: IdeaData[] = [];

  for (let i = 0; i < ideaCount; i++) {
    const idea = entities.createIdea(`idea-${i}`);
    await ideas.create(i === 0 ? admin : userBrowser, idea);
    createdIdeas.push(idea);
  }

  return {
    room,
    ideas: createdIdeas,
    cleanup: async () => {
      for (const idea of createdIdeas) {
        try {
          await ideas.remove(admin, room, idea);
        } catch (e) {
          // Idea may have been deleted by the test
        }
      }
      await rooms.remove(admin, room);
    },
  };
}
