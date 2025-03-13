import { FilterOptionsType } from '@/components/FilterBar/FilterBar';
import { StatusTypes } from '@/types/Generics';
import { MessageType, PossibleFields } from '@/types/Scopes';
import { databaseRequest, GenericResponse, RequestObject } from '@/utils';
import { checkPermissions } from '@/utils';

/**
 * Get a list of messages from the database.
 */

interface GetMessageResponse extends GenericResponse {
  data: MessageType | null;
}

export const getMessage = async (message_id: string): Promise<GetMessageResponse> => {
  // Check if user has Super Moderator (40) access to view all rooms

  const response = await databaseRequest({
    model: 'Message',
    method: 'getMessageBaseData',
    arguments: {
      message_id,
    },
  });

  return response as GetMessageResponse;
};

/**
 * Get a list of messages from the database.
 */

interface GetMessagesResponse extends GenericResponse {
  data: MessageType[] | null;
}

export const getMessages = async (): Promise<GetMessagesResponse> => {
  const hasSuperModAccess = checkPermissions('messages', 'viewAll');

  const response = await databaseRequest(
    {
      model: 'Message',
      method: hasSuperModAccess ? 'getMessages' : 'getMessagesByUser',
      arguments: {},
    },
    hasSuperModAccess ? [] : ['user_id']
  );

  return response as GetMessagesResponse;
};

/**
 * Get a list of messages from the database.
 */

export const getPersonalMessages = async (): Promise<GetMessagesResponse> => {
  const response = await databaseRequest(
    {
      model: 'Message',
      method: 'getPersonalMessagesByUser',
      arguments: {},
    },
    ['user_id']
  );

  return response as GetMessagesResponse;
};

export interface MessageArguments {
  headline?: string;
  body?: string;
  status?: StatusTypes;
}

export interface ReportArguments {
  report?: string;
  content?: string;
  status?: StatusTypes;
}

export interface BugArguments {
  content?: string;
  status?: StatusTypes;
}
/**
 * Create a message messages on the database.
 */

interface AddMessageArguments extends MessageArguments {
  msg_type: 0 | 1 | 2 | 3 | 4 | 5; // 1=system message, 2= message from admin, 3=message from user, 4=report, 5= requests
  target_id?: string | number;
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
 * Sets message Status.
 */

interface MessageStatusArguments {
  status: StatusTypes;
  message_id: string;
}

export const setMessageStatus = async (args: MessageStatusArguments): Promise<GenericResponse> => {
  const response = await databaseRequest(
    {
      model: 'Message',
      method: 'setMessageStatus',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
};

/**
 * Get a list of reports from the database.
 */

const getSpecialMessages = async (args: FilterOptionsType, msg_type: 4 | 5): Promise<GetMessagesResponse> => {
  const requestData = {
    msg_type,
    status: typeof args.status === 'number' ? args.status : 1,
  } as Record<keyof PossibleFields, string | number>;

  const response = await databaseRequest({
    model: 'Message',
    method: 'getMessages',
    arguments: requestData,
  });

  return response as GetMessagesResponse;
};

export const getReports = async (args: FilterOptionsType): Promise<GetMessagesResponse> => {
  return getSpecialMessages(args, 4);
};

/**
 * Adds a new report to the database
 */

export const addReport = async (args: MessageArguments): Promise<GetMessagesResponse> => {
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

/**
 * Get a list of reports from the database.
 */

export const getRequests = async (args: FilterOptionsType): Promise<GetMessagesResponse> => {
  return getSpecialMessages(args, 5);
};
