import { AnnouncementType } from '@/types/Scopes';
import { databaseRequest, GenericListRequest, GenericResponse } from './requests';
import { StatusTypes } from '@/types/Generics';

/**
 * Get an Announcement from the database.
 */

interface GetAnnouncementResponse extends GenericResponse {
  data: AnnouncementType | null;
}

export const getAnnouncement = async (text_id: string): Promise<GetAnnouncementResponse> => {
  const response = await databaseRequest({
    model: 'Text',
    method: 'getTextBaseData',
    arguments: {
      text_id,
    },
  });

  return response as GetAnnouncementResponse;
};

/**
 * Get a list of Announcements from the database.
 */

interface GetAnnouncementsResponse extends GenericResponse {
  data: AnnouncementType[] | null;
}

export const getAnnouncements = async (args: GenericListRequest): Promise<GetAnnouncementsResponse> => {
  const response = await databaseRequest(
    {
      model: 'Text',
      method: 'getTexts',
      arguments: args,
    },
    []
  );

  return response as GetAnnouncementsResponse;
};

/**
 * Sets Announcement update types
 */

export interface AnnouncementArguments {
  headline?: string;
  body?: string;
  user_needs_to_consent?: 0 | 1 | 2;
  consent_text?: string;
  status?: StatusTypes;
}

interface EditAnnouncementArguments extends AnnouncementArguments {
  text_id: string;
}

/**
 * Adds a new announcement to the database
 */

export async function addAnnouncement(args: AnnouncementArguments): Promise<GetAnnouncementsResponse> {
  const response = await databaseRequest(
    {
      model: 'Text',
      method: 'addText',
      arguments: args,
    },
    ['creator_id', 'updater_id']
  );

  return response as GetAnnouncementsResponse;
}

/**
 * Edit an announcement on the database
 */

export async function editAnnouncement(args: EditAnnouncementArguments): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Text',
      method: 'editText',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Removes an announcement from the database
 */

export async function deleteAnnouncement(id: string): Promise<GenericResponse> {
  const response = await databaseRequest(
    {
      model: 'Text',
      method: 'deleteText',
      arguments: {
        text_id: id,
      },
    },
    ['updater_id']
  );

  return response as GenericResponse;
}

/**
 * Sets announcement Status.
 */

interface AnnouncementStatusArguments {
  status: StatusTypes;
  text_id: string;
}

export const setAnnouncementStatus = async (args: AnnouncementStatusArguments): Promise<GenericResponse> => {
  const response = await databaseRequest(
    {
      model: 'Text',
      method: 'setTextStatus',
      arguments: args,
    },
    ['updater_id']
  );

  return response as GenericResponse;
};
