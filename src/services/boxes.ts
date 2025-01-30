import { DelegationType } from '@/types/Delegation';
import { StatusTypes } from '@/types/Generics';
import { BoxType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';
import { databaseRequest, GenericResponse } from '@/utils';

/**
 * Fetches box
 * @param box_id - The ID of the idea to fetch
 * @returns Promise resolving to an array of ideas with custom fields
 */

interface GetBoxResponse {
  data: BoxType | null;
  count: number | null;
  error: string | null;
}

export async function getBox(topic_id: string): Promise<GetBoxResponse> {
  const response = await databaseRequest({
    model: 'Topic',
    method: 'getTopicBaseData',
    arguments: { topic_id },
  });

  return response as GetBoxResponse;
}

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
  status?: StatusTypes;
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
 * @param box_id - The box id
 * @returns Promise resolving to the new box
 */

export async function deleteBox(box_id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Topic',
      method: 'deleteTopic',
      arguments: {
        topic_id: box_id,
      },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Gets an box delegation status from the database
 * @param box_id - The box id
 * @returns Promise resolving to the new box
 */

interface GetDelegationResponse extends GenericResponse {
  data: DelegationType[] | null;
}

export const getBoxDelegation = async (box_id: string): Promise<GetDelegationResponse> => {
  const response = await databaseRequest(
    {
      model: 'User',
      method: 'getDelegationStatus',
      arguments: {
        topic_id: box_id,
      },
    },
    ['user_id']
  );

  return response as GetDelegationResponse;
};
