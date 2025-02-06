import { CommentType, VoteType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from './requests';
import { DefaultUpdate } from '@/types/Generics';
import { GetIdeasResponse } from './ideas';

/**
 * Fetches dashboard data for the current user
 * Makes a database request to get user-specific dashboard information
 */

interface DashboardResponse {
  total_wild: number;
  total_idea_box: number;
  idea_ids: string;
  idea_ids_wild: string;
  idea_ids_box: string;
  phase_counts: Record<number, number>;
}

interface GetDashboardResponse extends GenericResponse {
  data: DashboardResponse | null;
}

export const getDashboard = async (): Promise<GetDashboardResponse> => {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'getDashboardByUser',
      arguments: {},
    },
    ['user_id']
  );

  return response as GetDashboardResponse;
};

/**
 * Fetches updates data for the current user
 * Makes a database request to get user-specific update information
 */ 0;

export interface UpdateResponse {
  votes: DefaultUpdate[];
  comments: DefaultUpdate[];
}

interface GetUpdatesResponse extends GenericResponse {
  data: UpdateResponse | null;
}

export const getUpdates = async (): Promise<GetUpdatesResponse> => {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'getUpdatesByUser',
      arguments: {},
    },
    ['user_id']
  );

  return response as GetUpdatesResponse;
};

/**
 * Fetches wild ideas data for the current user
 */

export const getWildIdeasByUser = async (): Promise<GetIdeasResponse> => {
  const response = await databaseRequest(
    {
      model: 'Idea',
      method: 'getWildIdeasByUser',
      arguments: {},
    },
    ['user_id']
  );

  return response as GetIdeasResponse;
};
