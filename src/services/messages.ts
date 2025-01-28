import { MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { checkPermissions } from '@/utils';

interface GetMessagesResponse {
  data: MessageType[] | null;
  count: number | null;
  error: string | null;
}

interface MessageArguments {
  headline: string;
  body: string;
}

/**
 * Get a list of messages from the database.
 */

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

/**
 * Get a list of messages from the database.
 */

export const addReport = async (args: MessageArguments): Promise<GetMessagesResponse> => {
  // Check if user has Super Moderator (40) access to view all rooms
  const hasSuperModAccess = checkPermissions(40);

  const response = await databaseRequest(
    {
      model: 'Message',
      method: 'addMessage',
      arguments: {
        msg_type: 4,
        ...args,
      },
    },
    ['creator_id']
  );

  return response as GetMessagesResponse;
};
