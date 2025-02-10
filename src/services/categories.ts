import { CategoryType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from './requests';

interface GetCategoriesResponse extends GenericResponse {
  data: CategoryType[] | null;
}

/**
 * Fetches the categories of an idea
 * @param idea_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
 */

export async function getCategories(idea_id?: string): Promise<GetCategoriesResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getCategories',
    arguments: idea_id ? { idea_id } : {},
  });

  return response as GetCategoriesResponse;
}

/**
 * Fetches the categories of an idea
 * @param idea_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
 */

export async function addIdeaCategory(idea_id: string, category_id: number): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'addIdeaToCategory',
      arguments: { idea_id, category_id },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

// /**
//  * Fetches the categories of an idea
//  * @param idea_id - The ID of the idea to like
//  * @returns Promise resolving to the updated idea list
//  */

// export async function getCategories(idea_id?: string): Promise<GetCategoriesResponse> {
//   const response = await databaseRequest({
//     model: 'Idea',
//     method: 'getCategories',
//     arguments: idea_id ? { idea_id } : {},
//   });

//   return response as GetCategoriesResponse;
// }

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
