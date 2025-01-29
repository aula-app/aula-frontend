import { BoxType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { databaseRequest, GenericResponse } from '@/utils';

/**
 * Fetches boxes for a specific room including custom fields
 * @param room_id - The ID of the room to fetch boxes for
 * @returns Promise resolving to an array of boxes with custom fields
 */

interface GetBoxesResponse {
  data: BoxType[] | null;
  count: number | null;
  error: string | null;
}

export async function getBoxesByPhase(phase_id: number, room_id?: string): Promise<GetBoxesResponse> {
  const response = await databaseRequest({
    model: 'Topic',
    method: 'getTopicsByPhase',
    arguments: {
      phase_id,
      room_id,
    },
  });

  return response as GetBoxesResponse;
}

/**
 * Sets Box update types
 */

interface BoxArguments {
  name: string;
  description_public: string;
  description_internal?: string;
  phase_duration_0?: number;
  phase_duration_1?: number;
  phase_duration_2?: number;
  phase_duration_3?: number;
  phase_duration_4?: number;
}

interface AddBoxArguments extends BoxArguments {
  room_id: string;
  phase_id: RoomPhases;
}

interface EditBoxArguments extends BoxArguments {
  topic_id: string;
  room_id?: string;
}

/**
 * Adds a new box to the database
 * @param arguments - The box data to add
 * @returns Promise resolving to the new box
 */

export async function addBox(args: AddBoxArguments): Promise<GetBoxesResponse> {
  const response = await databaseRequest(
    {
      model: 'Topic',
      method: 'addTopic',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GetBoxesResponse;
}

/**
 * Edit an box on the database
 * @param arguments - The box data to add
 * @returns Promise resolving to the new box
 */

export async function editBox(args: EditBoxArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Topic',
      method: 'editTopic',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Removes an box from the database
 * @param id - The box id
 * @returns Promise resolving to the new box
 */

export async function deleteBox(id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Topic',
      method: 'deleteTopic',
      arguments: {
        topic_id: id,
      },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}
