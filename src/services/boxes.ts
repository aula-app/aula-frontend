import { databaseRequest, GenericListRequest, GenericResponse } from '@/services/requests';
import { StatusTypes } from '@/types/Generics';
import { BoxType } from '@/types/Scopes';
import { RoomPhases } from '@/types/SettingsTypes';

/**
 * Fetches box
 */

interface GetBoxResponse extends GenericResponse {
  data: BoxType | null;
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
 */

interface BoxListRequest extends GenericListRequest {
  room_id?: string;
}

interface GetBoxesResponse extends GenericResponse {
  data: BoxType[] | null;
}

export async function getBoxes(args?: BoxListRequest): Promise<GetBoxesResponse> {
  const response = await databaseRequest({
    model: 'Topic',
    method: 'getTopics',
    arguments: args || { offset: 0, limit: 0 },
  });

  return response as GetBoxesResponse;
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

export interface BoxArguments {
  name?: string;
  description_public?: string;
  description_internal?: string;
  phase_duration_1?: number;
  phase_duration_2?: number;
  phase_duration_3?: number;
  phase_duration_4?: number;
  status?: StatusTypes;
}

interface AddBoxArguments extends BoxArguments {
  room_id: string;
  phase_id: RoomPhases;
  room_hash_id?: string;
}

interface EditBoxArguments extends BoxArguments {
  topic_id?: string;
  room_id?: number | string;
  phase_id?: number | string;
  room_hash_id?: string;
  hash_id?: string;
}

/**
 * Adds a new box to the database
 */

interface addResponse extends GenericResponse {
  data: { insert_id: number; hash_id: string } | null;
}

export async function addBox(args: AddBoxArguments): Promise<addResponse> {
  const response = await databaseRequest(
    {
      model: 'Topic',
      method: 'addTopic',
      arguments: args,
    },
    ['updater_id']
  );

  return response as addResponse;
}

/**
 * Edit an box on the database
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
 * Adds a new Survey to the database
 */

interface AddSurveyArguments extends BoxArguments {
  room_id: string;
  idea_headline: string;
  idea_content: string;
}

interface addResponse extends GenericResponse {
  data: { insert_id: number; hash_id: string } | null;
}

export async function addSurvey(args: AddSurveyArguments): Promise<addResponse> {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'addSurvey',
      arguments: args,
    },
    ['updater_id']
  );

  return response as addResponse;
}
