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
 * Sets category update types
 */

export interface CategoryArguments {
  name: string;
  description_internal: string; // label
  status?: string;
}

export interface EditCategoryArguments extends CategoryArguments {
  category_id: number;
}

/**
 * Adds a new category to the database
 */

export interface AddResponse extends GenericResponse {
  data: { id: number } | null;
}

export async function addCategory(args: CategoryArguments): Promise<AddResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'addCategory',
      arguments: args,
    },
    ['updater_id']
  );

  return response as AddResponse;
}

/**
 * Edit a category on the database
 */

export async function editCategory(args: EditCategoryArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'editCategory',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Removes an idea from the database
 */

export async function deleteCategory(category_id: number): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'deleteCategory',
      arguments: {
        category_id,
      },
    },
    ['updater_id']
  );

  return response as GenericResponse;
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

/**
 * Fetches the categories of an idea
 * @param idea_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
 */

export async function removeIdeaCategory(idea_id: string, category_id: number): Promise<GenericResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'removeIdeaFromCategory',
    arguments: { idea_id, category_id },
  });

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
