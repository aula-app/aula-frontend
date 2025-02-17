import { RoomType } from '@/types/Scopes';
import { RoleTypes } from '@/types/SettingsTypes';
import { databaseRequest, GenericListRequest, GenericResponse } from '@/utils';
import { checkPermissions } from '@/utils';

export interface GetRoomResponse extends GenericResponse {
  data: RoomType | null;
}

export const getRoom = async function (room_id: string): Promise<GetRoomResponse> {
  const response = await databaseRequest({
    model: 'Room',
    method: 'getRoomBaseData',
    arguments: {
      room_id: room_id,
    },
  });

  return response as GetRoomResponse;
};

/**
 * Get a list of rooms from the database.
 */

export interface GetRoomsResponse extends GenericResponse {
  data: RoomType[] | null;
}

interface RoomListRequest extends GenericListRequest {
  type?: number;
}

export const getRooms = async (
  args: RoomListRequest = {
    offset: 0,
    limit: 0,
    orderby: 0,
    asc: 0,
    type: 0,
  }
): Promise<GetRoomsResponse> => {
  // Check if room has Super Moderator (40) access to view all rooms
  const hasSuperModAccess = checkPermissions(40);

  if (!hasSuperModAccess) delete args.type;

  const response = await databaseRequest(
    {
      model: 'Room',
      method: hasSuperModAccess ? 'getRooms' : 'getRoomsByUser',
      arguments: args,
    },
    hasSuperModAccess ? [] : ['user_id']
  );

  return response as GetRoomsResponse;
};

export const getAllRooms = async (
  args: RoomListRequest = {
    offset: 0,
    limit: 0,
    orderby: 0,
    asc: 0,
  }
): Promise<GetRoomsResponse> => {
  const response = await databaseRequest(
    {
      model: 'Room',
      method: 'getRooms',
      arguments: args,
    },
    []
  );

  return response as GetRoomsResponse;
};

/**
 * Get a list of the rooms of a user from the database.
 */

export const getRoomsByUser = async (user_id: string): Promise<GetRoomsResponse> => {
  const response = await databaseRequest({
    model: 'Room',
    method: 'getRoomsByUser',
    arguments: { user_id },
  });

  return response as GetRoomsResponse;
};

/**
 * Get a list of the rooms of a user from the database.
 */

export const getRoomsByUser = async (user_id: string): Promise<GetRoomsResponse> => {
  const response = await databaseRequest({
    model: 'Room',
    method: 'getRoomsByUser',
    arguments: { user_id },
  });

  return response as GetRoomsResponse;
};

/**
 * Sets Room update types
 */

export interface RoomArguments {
  room_name?: string;
  description_internal?: string;
  description_public?: string;
  internal_info?: string;
  phase_duration_1?: number;
  phase_duration_2?: number;
  phase_duration_3?: number;
  phase_duration_4?: number;
  status?: number;
}

export interface EditRoomArguments extends RoomArguments {
  room_id: string;
}

/**
 * Adds a new room to the database
 */

interface addResponse extends GenericResponse {
  data: { insert_id: number; hash_id: string } | null;
}

export async function addRoom(args: RoomArguments): Promise<addResponse> {
  const response = await databaseRequest(
    {
      model: 'Room',
      method: 'addRoom',
      arguments: args,
    },
    ['updater_id']
  );

  return response as addResponse;
}

/**
 * Edit an room on the database
 */

export async function editRoom(args: EditRoomArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Room',
      method: 'editRoom',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Delete room
 */

export async function deleteRoom(room_id: string): Promise<GenericResponse> {
  const response = await databaseRequest({
    model: 'Room',
    method: 'deleteRoom',
    arguments: { room_id },
  });

  return response as GenericResponse;
}

/**
 * Get user rooms
 */

interface GetRoomUsersResponse extends GenericResponse {
  data: { hash_id: string }[] | null;
}

export async function getRoomUsers(room_id: string): Promise<GetRoomUsersResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'getUsersByRoom',
    arguments: { room_id },
  });

  return response as GetRoomUsersResponse;
}
