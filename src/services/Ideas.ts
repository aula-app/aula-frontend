import { StatusTypes } from '@/types/Generics';
import { IdeaType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from '@/utils';

/**
 * Fetches ideas for a specific room including custom fields
 * @param room_id - The ID of the room to fetch ideas for
 * @returns Promise resolving to an array of ideas with custom fields
 */

interface GetIdeasResponse {
  data: IdeaType[] | null;
  count: number | null;
  error: string | null;
}

export async function getIdeasByRoom(room_id: string): Promise<GetIdeasResponse> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeasByRoom',
    arguments: { room_id },
  });

  return response as GetIdeasResponse;
}

/**
 * Sets Idea update types
 */

interface IdeaArguments {
  title: string;
  content: string;
  custom_field1?: string;
  custom_field2?: string;
  status?: StatusTypes;
}

interface AddIdeaArguments extends IdeaArguments {
  room_id: string;
}

interface EditIdeaArguments extends IdeaArguments {
  idea_id: string;
  room_id?: string;
}

/**
 * Adds a new idea to the database
 * @param arguments - The idea data to add
 * @returns Promise resolving to the new idea
 */

export async function addIdea(args: AddIdeaArguments): Promise<GetIdeasResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'addIdea',
      arguments: args,
    },
    ['user_id']
  );

  return response as GetIdeasResponse;
}

/**
 * Edit an idea on the database
 * @param arguments - The idea data to add
 * @returns Promise resolving to the new idea
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
 * @param id - The idea id
 * @returns Promise resolving to the new idea
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
