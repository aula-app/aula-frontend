import { StatusTypes } from '@/types/Generics';
import { IdeaType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';

/**
 * Adds a new idea to the database
 * @param arguments - The idea data to add
 * @returns Promise resolving to the new idea
 */

interface IdeaArguments {
  title: string;
  content: string;
  room_id: string;
  custom_field1?: string;
  custom_field2?: string;
  status?: StatusTypes;
}

export async function addIdeas(args: IdeaArguments): Promise<GetIdeasResponse> {
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
