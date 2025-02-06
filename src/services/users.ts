import { StatusTypes } from '@/types/Generics';
import { UserType } from '@/types/Scopes';
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

export async function getUsers(args: UserListRequest): Promise<GetUsersResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'getUsers',
    arguments: args,
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
  userlevel: string;
}

export interface EditUserArguments extends UserArguments {
  user_id: string;
  userlevel?: string;
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

export async function getUserRooms(user_id: string): Promise<GetUserRoomsResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'getUserRooms',
    arguments: { user_id },
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
