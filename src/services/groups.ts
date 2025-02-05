import { GroupType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from './requests';

/**
 * Get a list of Groups from the database.
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
