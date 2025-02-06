import { StatusTypes } from '@/types/Generics';
import { IdeaType } from '@/types/Scopes';
import { databaseRequest, GenericListRequest, GenericResponse } from '@/utils';

/**
 * Fetches idea
 */

interface GetIdeaResponse extends GenericResponse {
  data: IdeaType | null;
}

export async function getIdea(idea_id: string): Promise<GetIdeaResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeaBaseData',
    arguments: { idea_id },
  });

  return response as GetIdeaResponse;
}

/**
 * Fetches all ideas
 */

export interface GetIdeasResponse extends GenericResponse {
  data: IdeaType[] | null;
}

export async function getIdeas(args: GenericListRequest): Promise<GetIdeasResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeas',
    arguments: args,
  });

  return response as GetIdeasResponse;
}

/**
 * Fetches ideas for a specific room
 */

export async function getIdeasByRoom(room_id: string): Promise<GetIdeasResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeasByRoom',
    arguments: { room_id },
  });

  return response as GetIdeasResponse;
}

/**
 * Fetches ideas for a specific box
 */

export async function getIdeasByBox(topic_id: string): Promise<GetIdeasResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeasByTopic',
    arguments: { topic_id },
  });

  return response as GetIdeasResponse;
}

/**
 * Sets Idea update types
 */

export interface IdeaArguments {
  title: string;
  content: string;
  custom_field1?: string;
  custom_field2?: string;
  status?: StatusTypes;
}

export interface AddIdeaArguments extends IdeaArguments {
  room_hash_id: string;
}

export interface EditIdeaArguments extends IdeaArguments {
  idea_id: string;
  room_hash_id?: string;
}

/**
 * Adds a new idea to the database
 */

export async function addIdea(args: AddIdeaArguments): Promise<GetIdeasResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'addIdea',
      arguments: args,
    },
    ['user_id', 'updater_id']
  );

  return response as GetIdeasResponse;
}

/**
 * Edit an idea on the database
 */

export async function editIdea(args: EditIdeaArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'editIdea',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Removes an idea from the database
 */

export async function deleteIdea(id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'deleteIdea',
      arguments: {
        idea_id: id,
      },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * NOT WORKING
 * Fetches custom fields configuration
 * @returns Promise resolving to custom fields configuration
 */
// export async function getCustomFields(): Promise<CustomFieldsType> {
//   const response = await databaseRequest({
//     model: 'Settings',
//     method: 'getCustomfields',
//     arguments: {},
//   });

//   if (!response.success || !response.data) {
//     throw new Error('Failed to fetch custom fields');
//   }

//   const data = response.data as CustomFieldsNameType;
//   return {
//     custom_field1: data.custom_field1_name,
//     custom_field2: data.custom_field2_name,
//   };
// }

/**
 * Fetches the like status of an idea
 * @param idea_id - The ID of the idea to like
 * @returns Promise resolving to the updated idea list
 */

export async function getIdeaLike(idea_id: string): Promise<boolean> {
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
 */

export async function addIdeaLike(idea_id: string): Promise<void> {
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
 */

export async function removeIdeaLike(idea_id: string): Promise<void> {
  await databaseRequest(
    {
      model: 'Idea',
      method: 'IdeaRemoveLike',
      arguments: { idea_id },
    },
    ['user_id']
  );
}
