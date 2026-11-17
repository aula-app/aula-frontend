import { getAdminMessages, getPersonalMessages } from '@/services/messages';
import { checkPermissions } from '@/utils';

export const MESSAGE_STATUS = { active: 1, archived: 3 } as const;
export type InboxStatus = keyof typeof MESSAGE_STATUS;

/** The user's messages in a status; admins also get the ones sent to no one in particular (reports, bugs, requests). */
export const getInboxMessages = async (status: InboxStatus = 'active') => {
  const response = checkPermissions('reports', 'viewAll') ? await getAdminMessages() : await getPersonalMessages();
  // The admin query does not filter by status, so other statuses would otherwise mix in.
  return Array.isArray(response.data)
    ? { ...response, data: response.data.filter((message) => Number(message.status) === MESSAGE_STATUS[status]) }
    : response;
};
