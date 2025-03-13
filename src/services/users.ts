import { StatusTypes } from '@/types/Generics';
import { DelegationType, UserType } from '@/types/Scopes';
import { RoleTypes } from '@/types/SettingsTypes';
import { databaseRequest, GenericListRequest, GenericResponse } from '@/utils';

interface GetUserResponse extends GenericResponse {
  data: UserType | null;
}

interface GetUsersResponse extends GenericResponse {
  data: UserType[] | null;
}

/**
 * Fetches users from DB
 */

interface UserListRequest extends GenericListRequest {
  room_id?: string;
  userlevel?: 0 | RoleTypes;
}

export async function getUsers(args?: UserListRequest): Promise<GetUsersResponse> {
  if (args?.room_id === 'all') delete args.room_id;
  const method = args?.room_id ? 'getUsersByRoom' : 'getUsers';
  const response = await databaseRequest({
    model: 'User',
    method: method,
    arguments: args || { offset: 0, limit: 0 },
  });

  return response as GetUsersResponse;
}

/**
 * Fetches user
 */

export async function getUser(user_id: string): Promise<GetUserResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'getUserBaseData',
    arguments: { user_id },
  });

  return response as GetUserResponse;
}

/**
 * Sets User update types
 */

export interface UserArguments {
  realname?: string;
  username?: string;
  displayname?: string;
  email?: string;
  about_me?: string;
  status?: StatusTypes;
}

export interface AddUserArguments extends UserArguments {
  userlevel: RoleTypes;
}

export interface EditUserArguments extends UserArguments {
  user_id?: string;
  userlevel?: RoleTypes;
}

/**
 * Adds a new user to the database
 */

interface addResponse extends GenericResponse {
  data: { insert_id: string; hash_id: string; temp_pw: string } | null;
}

export async function addUser(args: AddUserArguments): Promise<addResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'addUser',
      arguments: args,
    },
    ['updater_id']
  );

  return response as addResponse;
}

/**
 * Edit an user on the database
 */

export async function editUser(args: EditUserArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'editUser',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Delete user
 */

export async function deleteUser(user_id: string): Promise<GetUserResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'deleteUser',
    arguments: { user_id },
  });

  return response as GetUserResponse;
}

/**
 * Fetches current user
 */

export async function getSelf(): Promise<GetUserResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'getUserBaseData',
      arguments: {},
    },
    ['user_id']
  );

  return response as GetUserResponse;
}

/**
 * Edit the user on the database
 */

export async function editSelf(args: UserArguments): Promise<GenericResponse> {
  let count = 0;
  if (args.about_me) {
    await databaseRequest(
      {
        model: 'User',
        method: 'setUserAbout',
        arguments: {
          about_me: args.about_me,
        },
      },
      ['user_id', 'updater_id']
    ).then((response) => {
      if (!response.error) count++;
    });
  }

  if (args.displayname) {
    await databaseRequest(
      {
        model: 'User',
        method: 'setUserDisplayname',
        arguments: {
          displayname: args.displayname,
        },
      },
      ['user_id', 'updater_id']
    ).then((response) => {
      if (!response.error) count++;
    });
  }

  const response = {
    data: count > 0,
    count: count,
    error: count < 2 ? 'errors.default' : null,
  };

  return response as GenericResponse;
}

interface RestrictedUpdateArgs {
  field: 'realname' | 'username' | 'email';
  id: string;
  value: string;
}

export async function editSelfRestricted(args: RestrictedUpdateArgs) {
  const method = {
    email: 'setUserEmail',
    realname: 'setUserRealname',
    username: 'setUserUsername',
  };
  const request = await databaseRequest(
    {
      model: 'User',
      method: method[args.field],
      arguments: {
        user_id: args.id,
        [args.field]: args.value,
      },
    },
    ['updater_id']
  );
  return request;
}

/**
 * Get user GDPR data
 */

export async function exportSelfData(): Promise<GetUserResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'getUserGDPRData',
      arguments: {},
    },
    ['user_id']
  );

  return response as GetUserResponse;
}

/**
 * Get user rooms
 */

interface GetUserRoomsResponse extends GenericResponse {
  data: { hash_id: string }[] | null;
}

export async function getUserRooms(user_id: string, type?: 0 | 1): Promise<GetUserRoomsResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'getUserRooms',
    arguments: { user_id, type },
  });

  return response as GetUserRoomsResponse;
}

/**
 * Add user room
 */

export async function addUserRoom(user_id: string, room_id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'addUserToRoom',
      arguments: { user_id, room_id },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Remove user room
 */

export async function removeUserRoom(user_id: string, room_id: string): Promise<GenericResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'removeUserFromRoom',
    arguments: { user_id, room_id },
  });

  return response as GenericResponse;
}

/**
 * Get user rooms
 */

interface GetUserGroupsResponse extends GenericResponse {
  data: { hash_id: string }[] | null;
}

export async function getUserGroups(user_id: string): Promise<GetUserGroupsResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'getUserGroups',
    arguments: { user_id },
  });

  return response as GetUserGroupsResponse;
}

/**
 * Add user group
 */

export async function addUserGroup(user_id: string, group_id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'addUserToGroup',
      arguments: { user_id, group_id },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Remove user group
 */

export async function removeUserGroup(user_id: string, group_id: string): Promise<GenericResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'removeUserFromGroup',
    arguments: { user_id, group_id },
  });

  return response as GenericResponse;
}

/**
 * Gets a list of possible delegates, filtering non voting roles, and including availability status from delegation
 */

export type DelegateType = {
  hash_id: string;
  username: string;
  displayname: string;
  realname: string;
  is_delegate: number;
};

interface PossibleDelegateResponse extends GenericResponse {
  data: DelegateType[];
}

interface PossibleDelegationsRequest {
  room_id: string;
  topic_id: string;
}

export async function getPossibleDelegations(args: PossibleDelegationsRequest): Promise<PossibleDelegateResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'getPossibleDelegations',
      arguments: args,
    },
    ['user_id']
  );

  return response as PossibleDelegateResponse;
}

/**
 * Gets an box delegation status from the database
 */

interface GetDelegationResponse extends GenericResponse {
  data: DelegationType[] | null;
}

export const getDelegations = async (box_id: string): Promise<GetDelegationResponse> => {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'getDelegationStatus',
      arguments: {
        topic_id: box_id,
      },
    },
    ['user_id']
  );

  return response as GetDelegationResponse;
};

/**
 * Gets an box delegation status from the database
 */

interface GetReceivedDelegationsResponse extends GenericResponse {
  data: UserType[] | null;
}

export const getReceivedDelegations = async (box_id: string): Promise<GetReceivedDelegationsResponse> => {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'getReceivedDelegations',
      arguments: {
        topic_id: box_id,
      },
    },
    ['user_id']
  );

  return response as GetReceivedDelegationsResponse;
};

/**
 * Add delegation
 */

export async function delegateVote(target_id: string, topic_id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'delegateVoteRight',
      arguments: {
        user_id_target: target_id,
        topic_id,
      },
    },
    ['user_id', 'updater_id']
  );

  return response as GenericResponse;
}

/**
 * Remove delegation
 */

export async function revokeDelegation(topic_id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'giveBackAllDelegations',
      arguments: {
        topic_id,
      },
    },
    ['user_id']
  );

  return response as GenericResponse;
}

/**
 * Set special roles
 */

export async function addSpecialRoles(user_id: string, role: RoleTypes, room_id: string): Promise<GenericResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'addUserRole',
    arguments: {
      user_id,
      role,
      room_id,
    },
  });

  return response as GenericResponse;
}
