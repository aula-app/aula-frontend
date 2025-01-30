import { StatusTypes } from '@/types/Generics';
import { UserType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from '@/utils';

interface GetUserResponse extends GenericResponse {
  data: UserType | null;
}

/**
 * Fetches user
 * @param user_id - The ID of the user to fetch
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

interface UserArguments {
  realname: string;
  username: string;
  displayname: string;
  email?: string;
  about_me?: string;
  status?: StatusTypes;
}

/**
 * Edit an user on the database
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
