import { CategoryType } from '@/types/Scopes';
import { databaseRequest } from './requests';

interface GetCategoriesResponse {
  data: CategoryType | null;
  count: number | null;
  error: string | null;
}

/**
 * Fetches the categories of an idea
 * @param idea_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
 */

export async function getCategories(idea_id: string): Promise<GetCategoriesResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeaCategory',
    arguments: { idea_id },
  });

  return response as GetCategoriesResponse;
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
