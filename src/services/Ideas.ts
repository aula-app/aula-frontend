import { IdeaType } from '@/types/Scopes';
import { CustomFieldsType, CustomFieldsNameType } from '@/types/SettingsTypes';
import { databaseRequest } from '@/utils';

/**
 * Fetches ideas for a specific room including custom fields
 * @param room_id - The ID of the room to fetch ideas for
 * @returns Promise resolving to an array of ideas with custom fields
 */
export async function getIdeasByRoom(room_id: string): Promise<IdeaType[]> {
  const response = await databaseRequest({
    model: 'Idea',
    method: 'getIdeasByRoom',
    arguments: { room_id },
  });

  if (!response.success || !response.data) {
    throw new Error('Failed to fetch ideas');
  }

  return response.data as IdeaType[];
}

/**
 * Fetches custom fields configuration
 * @returns Promise resolving to custom fields configuration
 */
export async function getCustomFields(): Promise<CustomFieldsType> {
  const response = await databaseRequest({
    model: 'Settings',
    method: 'getCustomfields',
    arguments: {},
  });

  if (!response.success || !response.data) {
    throw new Error('Failed to fetch custom fields');
  }

  const data = response.data as CustomFieldsNameType;
  return {
    custom_field1: data.custom_field1_name,
    custom_field2: data.custom_field2_name,
  };
}

/**
 * Fetches ideas for a room including custom fields configuration
 * @param room_id - The ID of the room to fetch ideas for
 * @returns Promise resolving to ideas and custom fields
 */
export async function getIdeasWithCustomFields(room_id: string): Promise<{
  ideas: IdeaType[];
  fields: CustomFieldsType;
}> {
  const [ideas, fields] = await Promise.all([getIdeasByRoom(room_id), getCustomFields()]);

  return { ideas, fields };
}
