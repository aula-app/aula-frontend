import { databaseRequest, GenericResponse } from './requests';

/**
 * gets user avatar url
 * @param user_id - The ID of the user
 * @returns Promise resolving to the avatar url
 */

interface GetAvatarResponse extends GenericResponse {
  data: { filename: string }[] | null;
}

export async function getAvatar(user_id: string): Promise<GetAvatarResponse> {
  const response = await databaseRequest({
    model: 'Media',
    method: 'userAvatar',
    arguments: { user_id: user_id },
  });

  return response as GetAvatarResponse;
}
