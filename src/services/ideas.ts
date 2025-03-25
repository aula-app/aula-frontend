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

interface IdeasListRequest extends GenericListRequest {
  room_id?: string;
  user_id?: string | 0;
}

export interface GetIdeasResponse extends GenericResponse {
  data: IdeaType[] | null;
}

export async function getIdeas(args: IdeasListRequest): Promise<GetIdeasResponse> {
  if (args?.room_id === 'all') delete args.room_id;
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

interface BoxIdeasListRequest {
  offset?: number;
  limit?: number;
  orderby?: number;
  asc?: 0 | 1;
  search_field?: string;
  search_text?: string;
  both_names?: string;
  status?: StatusTypes;
  room_id?: string;
  topic_id?: string;
}

export async function getIdeasByBox(args: BoxIdeasListRequest): Promise<GetIdeasResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeasByTopic',
    arguments: args,
  });

  return response as GetIdeasResponse;
}

interface UserIdeasListRequest {
  offset?: number;
  limit?: number;
  orderby?: number;
  asc?: 0 | 1;
  search_field?: string;
  search_text?: string;
  both_names?: string;
  status?: StatusTypes;
  room_id?: string;
  user_id?: string;
}

export async function getIdeasByUser(args: UserIdeasListRequest): Promise<GetIdeasResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeasByUser',
    arguments: args,
  });

  return response as GetIdeasResponse;
}

/**
 * Sets Idea update types
 */

export interface IdeaArguments {
  title?: string;
  content?: string;
  custom_field1?: string;
  custom_field2?: string;
  status?: StatusTypes;
  room_hash_id?: string;
}

export interface AddIdeaArguments extends IdeaArguments {
  room_id: string;
}

export interface EditIdeaArguments extends IdeaArguments {
  idea_id: string;
  room_id?: string;
  approved?: -1 | 0 | 1;
}

/**
 * Adds a new idea to the database
 */

export interface AddIdeaResponse extends GenericResponse {
  data: { hash_id: string } | null;
}

export async function addIdea(args: AddIdeaArguments): Promise<AddIdeaResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'addIdea',
      arguments: args,
    },
    ['user_id', 'updater_id']
  );

  return response as AddIdeaResponse;
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

//   if (!response.data || !response.data) {
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

/**
 * Get user rooms
 */

interface GetIdeaBoxesResponse extends GenericResponse {
  data: { hash_id: string; name: string }[] | null;
}

export async function getIdeaBoxes(idea_id: string): Promise<GetIdeaBoxesResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeaTopic',
    arguments: { idea_id },
  });

  return response as GetIdeaBoxesResponse;
}

/**
 * Add user room
 */

export async function addIdeaBox(idea_id: string, topic_id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'addIdeaToTopic',
      arguments: { idea_id, topic_id },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Remove user room
 */

export async function removeIdeaBox(idea_id: string, topic_id: string): Promise<GenericResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'removeIdeaFromTopic',
    arguments: { idea_id, topic_id },
  });

  return response as GenericResponse;
}

/**
 * Approve an idea
 */

interface ApproveIdeaArguments {
  idea_id: string;
  approved: number;
  approval_comment: string;
}

export async function setApprovalStatus(args: ApproveIdeaArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'setApprovalStatus',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

export async function setWinning(winnig_status: boolean, idea_id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: winnig_status ? 'setToWinning' : 'setToLosing',
      arguments: { idea_id },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}
