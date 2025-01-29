import { AnnouncementType } from '@/types/Scopes';
import { databaseRequest, GenericResponse } from './requests';

/**
 * Get a list of Announcements from the database.
 */

interface GetAnnouncementsResponse extends GenericResponse {
  data: AnnouncementType[] | null;
}

export const getAnnouncements = async (): Promise<GetAnnouncementsResponse> => {
  const response = await databaseRequest(
    {
      model: 'Text',
      method: 'getTexts',
      arguments: {},
    },
    []
  );

  return response as GetAnnouncementsResponse;
};
