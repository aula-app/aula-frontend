import { RoomType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from '@/utils';
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

export const getRooms = async (): Promise<GetRoomsResponse> => {
  // Check if user has Super Moderator (40) access to view all rooms
  const hasSuperModAccess = checkPermissions(40);

  const response = await databaseRequest(
    {
      model: 'Room',
      method: hasSuperModAccess ? 'getRooms' : 'getRoomsByUser',
      arguments: {
        offset: 0,
        limit: 0,
      },
    },
    hasSuperModAccess ? [] : ['user_id']
  );

  return response as GetRoomsResponse;
};
