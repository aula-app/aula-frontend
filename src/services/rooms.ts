import { RoomType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { checkPermissions } from '@/utils';

interface GetRoomsResponse {
  data: RoomType[] | null;
  error: string | null;
}

export const getRooms = async (): Promise<GetRoomsResponse> => {
  try {
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

    if (!response.success || !response.data) {
      return {
        data: null,
        error: 'Failed to fetch rooms',
      };
    }

    return {
      data: response.data as RoomType[],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
