import { AnnouncementType } from '@/types/Scopes';
import { databaseRequest } from './requests';

/**
 * Get a list of Announcements from the database.
 */

interface GetAnnouncementsResponse {
  data: AnnouncementType[] | null;
  error: string | null;
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
