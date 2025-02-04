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
 * @returns Promise resolving to an array of users with custom fields
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
 * @param user_id - The ID of the user to fetch
 * @returns Promise resolving to an array of users with custom fields
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
  realname: string;
  username: string;
  displayname: string;
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

export async function addUser(args: AddUserArguments): Promise<GetUsersResponse> {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'addUser',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GetUsersResponse;
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
 * @returns Promise resolving to an array of users with custom fields
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
 * @param arguments - The user data to add
 * @returns Promise resolving to the new user
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
 * @returns Promise resolving to an array of users with custom fields
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
