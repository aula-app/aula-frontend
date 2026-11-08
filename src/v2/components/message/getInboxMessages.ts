import { getAdminMessages, getPersonalMessages } from '@/services/messages';
import { checkPermissions } from '@/utils';

const ACTIVE = 1;

/** The user's active messages; admins also get the ones sent to no one in particular (reports, bugs, requests). */
export const getInboxMessages = async () => {
  const response = checkPermissions('reports', 'viewAll') ? await getAdminMessages() : await getPersonalMessages();
  // The admin query does not filter by status, so archived messages would otherwise linger.
  return Array.isArray(response.data)
    ? { ...response, data: response.data.filter((message) => Number(message.status) === ACTIVE) }
    : response;
};
