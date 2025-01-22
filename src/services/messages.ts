import { MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { checkPermissions } from '@/utils';

/**
 * Get a list of messages from the database.
 */

interface GetMessagesResponse {
  data: MessageType[] | null;
  count: number | null;
  error: string | null;
}

export const getMessages = async (): Promise<GetMessagesResponse> => {
  // Check if user has Super Moderator (40) access to view all rooms
  const hasSuperModAccess = checkPermissions(40);

  const response = await databaseRequest(
    {
      model: 'Message',
      method: hasSuperModAccess ? 'getMessages' : 'getMessagesByUser',
      arguments: {
        offset: 0,
        limit: 0,
      },
    },
    hasSuperModAccess ? [] : ['user_id']
  );

  return response as GetMessagesResponse;
};
