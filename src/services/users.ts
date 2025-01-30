import { UserType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from '@/utils';

interface GetUserResponse extends GenericResponse {
  data: UserType | null;
}

/**
 * Fetches user
 * @param user_id - The ID of the idea to fetch
 * @returns Promise resolving to an array of ideas with custom fields
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
 * @param user_id - The ID of the idea to fetch
 * @returns Promise resolving to an array of ideas with custom fields
 */

export async function getUser(user_id: string): Promise<GetUserResponse> {
  const response = await databaseRequest({
    model: 'User',
    method: 'getUserBaseData',
    arguments: { user_id },
  });

  return response as GetUserResponse;
}
