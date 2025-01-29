import { RoomType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from '@/utils';
import { checkPermissions } from '@/utils';

/**
 * Get a list of rooms from the database.
 */

interface GetRoomsResponse extends GenericResponse {
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
