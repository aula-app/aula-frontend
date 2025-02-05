import { GroupType } from '@/types/Scopes';
import { databaseRequest, GenericListRequest, GenericResponse } from './requests';

/**
 * Get a Group from the database.
 */

interface GetGroupResponse extends GenericResponse {
  data: GroupType | null;
}

export const getGroup = async (id: string): Promise<GetGroupResponse> => {
  const response = await databaseRequest({
    model: 'Group',
    method: 'getGroupBaseData',
    arguments: {
      group_id: id,
    },
  });

  return response as GetGroupResponse;
};

/**
 * Get a list of Groups from the database.
 */

interface GetGroupsResponse extends GenericResponse {
  data: GroupType[] | null;
}

export const getGroups = async (args?: GenericListRequest): Promise<GetGroupsResponse> => {
  const response = await databaseRequest({
    model: 'Group',
    method: 'getGroups',
    arguments: args || {},
  });

  return response as GetGroupsResponse;
};
