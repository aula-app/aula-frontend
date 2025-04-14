import { GroupType, UserType } from '@/types/Scopes';
import { databaseRequest, GenericListRequest, GenericResponse } from './requests';

/**
 * Get a Group from the database.
 */

interface GetGroupResponse extends GenericResponse {
  data: GroupType | null;
}

export const getGroup = async (id: string): Promise<GetGroupResponse> => {
  const response = await databaseRequest({
    model: 'Group',
    method: 'getGroupBaseData',
    arguments: {
      group_id: id,
    },
  });

  return response as GetGroupResponse;
};

/**
 * Get a list of Groups from the database.
 */

interface GetGroupsResponse extends GenericResponse {
  data: GroupType[] | null;
}

export const getGroups = async (args?: GenericListRequest): Promise<GetGroupsResponse> => {
  const response = await databaseRequest({
    model: 'Group',
    method: 'getGroups',
    arguments: args || {},
  });

  return response as GetGroupsResponse;
};

/**
 * Sets group update types
 */

export interface GroupArguments {
  group_name: string;
  description_public?: string;
  status?: string;
}

export interface EditGroupArguments extends GroupArguments {
  group_id: number;
}

/**
 * Adds a new group to the database
 */

export interface AddResponse extends GenericResponse {
  data: number | null;
}

export async function addGroup(args: GroupArguments): Promise<AddResponse> {
  const response = await databaseRequest(
    {
      model: 'Group',
      method: 'addGroup',
      arguments: args,
    },
    ['updater_id']
  );

  return response as AddResponse;
}

/**
 * Edit a group on the database
 */

export async function editGroup(args: EditGroupArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Group',
      method: 'editGroup',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Removes an idea from the database
 */

export async function deleteGroup(group_id: number): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Group',
      method: 'deleteGroup',
      arguments: {
        group_id,
      },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Adds a user to a group
 */
export interface AddUserToGroupArguments {
  user_id: string;
  group_id: number;
}

export async function addUserToGroup(args: AddUserToGroupArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'addUserToGroup',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

export async function removeUserFromGroup(args: AddUserToGroupArguments): Promise<GenericResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'removeUserFromGroup',
    arguments: args,
  });

  return response as GenericResponse;
}

/**
 * Get users in a group
 */
interface GetGroupUsersResponse extends GenericResponse {
  data: UserType[] | null;
}

export async function getGroupUsers(group_id: number): Promise<GetGroupUsersResponse> {
  const response = await databaseRequest({
    model: 'Group',
    method: 'getUsersInGroup',
    arguments: { group_id },
  });

  return response as GetGroupUsersResponse;
}
