import { FilterOptionsType } from '@/components/FilterBar/FilterBar';
import { StatusTypes } from '@/types/Generics';
import { MessageType, PossibleFields } from '@/types/Scopes';
import { databaseRequest, GenericListRequest, GenericResponse, RequestObject } from '@/utils';
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

const getMessages = async (): Promise<GetMessagesResponse> => {
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

export const getAllMessages = async (args: GenericListRequest): Promise<GetMessagesResponse> => {
  const response = await databaseRequest(
    {
      model: 'Message',
      method: 'getMessages',
      arguments: args,
    },
    []
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

export const getAdminMessages = async (): Promise<GetMessagesResponse> => {
  const response = await databaseRequest(
    {
      model: 'Message',
      method: 'getAdminMessages',
      arguments: {},
    },
    ['user_id']
  );

  return response as GetMessagesResponse;
};

interface MessageArguments {
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
  msg_type?: number;
  target_id?: string | number | null;
  target_group?: string | number | null;
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

interface EditMessageArguments extends AddMessageArguments {
  message_id: number;
}

export const editMessage = async (args: EditMessageArguments): Promise<GenericResponse> => {
  const response = await databaseRequest(
    {
      model: 'Message',
      method: 'editMessage',
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
 * Removes a message from the database
 */

export async function deleteMessage(id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Message',
      method: 'deleteMessage',
      arguments: {
        message_id: id,
      },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Get a list of reports from the database.
 */

const getSpecialMessages = async (args: FilterOptionsType, msg_type: 4 | 5 | 6): Promise<GetMessagesResponse> => {
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

export const getBugs = async (args: FilterOptionsType): Promise<GetMessagesResponse> => {
  return getSpecialMessages(args, 5);
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

export const addBug = async (args: MessageArguments): Promise<GetMessagesResponse> => {
  const response = await databaseRequest(
    {
      model: 'Message',
      method: 'addMessage',
      arguments: {
        msg_type: 5,
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
  return getSpecialMessages(args, 6);
};
