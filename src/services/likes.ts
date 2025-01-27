/**
 * Fetches the like status of an idea
 * @param idea_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
 */

import { databaseRequest } from './requests';

export async function getLike(idea_id: string): Promise<boolean> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'getLikeStatus',
      arguments: { idea_id },
    },
    ['user_id']
  );

  return Boolean(response.data);
}

/**
 * Adds a like to an idea
 * @param idea_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
 */

export async function addLike(idea_id: string): Promise<void> {
  await databaseRequest(
    {
      model: 'Idea',
      method: 'IdeaAddLike',
      arguments: { idea_id },
    },
    ['user_id']
  );
}

/**
 * Removes a like to an idea
 * @param idea_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
 */

export async function removeLike(idea_id: string): Promise<void> {
  await databaseRequest(
    {
      model: 'Idea',
      method: 'IdeaRemoveLike',
      arguments: { idea_id },
    },
    ['user_id']
  );
}
