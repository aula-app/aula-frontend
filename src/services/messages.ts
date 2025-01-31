import { MessageType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from '@/utils';
import { checkPermissions } from '@/utils';

interface GetMessagesResponse extends GenericResponse {
  data: MessageType[] | null;
}

interface MessageArguments {
  headline: string;
  body: string;
}

/**
 * Create a message messages on the database.
 */

interface AddMessageArguments extends MessageArguments {
  msg_type: 0 | 1 | 2 | 3 | 4 | 5; // 1=system message, 2= message from admin, 3=message from user, 4=report, 5= requests
  target_id?: string;
}

export const addMessage = async (args: AddMessageArguments): Promise<GenericResponse> => {
  const response = await databaseRequest(
    {
      model: 'Message',
      method: 'addMessage',
      arguments: { ...args },
    },
    ['creator_id', 'updater_id']
  );

  return response as GenericResponse;
};

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
 * Adds a new report to the database
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
