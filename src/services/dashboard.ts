import { CommentType, VoteType } from '@/types/Scopes';
import { databaseRequest } from './requests';

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

interface GetDashboardResponse {
  data: DashboardResponse | null;
  count: number | null;
  error: string | null;
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
 */

interface UpdateResponse {
  votes: VoteType[];
  comments: CommentType[];
}

interface GetUpdatesResponse {
  data: UpdateResponse | null;
  count: number | null;
  error: string | null;
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
