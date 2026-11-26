import { getAdminMessages, getPersonalMessages } from '@/services/messages';
import { checkPermissions } from '@/utils';

export const MESSAGE_STATUS = { active: 1, archived: 3 } as const;
export const INBOX_STATUSES = ['active', 'archived', 'all'] as const;
export type InboxStatus = (typeof INBOX_STATUSES)[number];

const STATUS_CODES: Record<InboxStatus, number[]> = {
  active: [MESSAGE_STATUS.active],
  archived: [MESSAGE_STATUS.archived],
  all: Object.values(MESSAGE_STATUS),
};

/** The user's messages in a status; admins also get the ones sent to no one in particular (reports, bugs, requests). */
export const getInboxMessages = async (status: InboxStatus = 'active') => {
  // Must match the backend, where getAdminMessages is admin-only.
  const response = checkPermissions('messages', 'viewAll') ? await getAdminMessages() : await getPersonalMessages();
  // The admin query does not filter by status, so other statuses would otherwise mix in.
  return Array.isArray(response.data)
    ? { ...response, data: response.data.filter((message) => STATUS_CODES[status].includes(Number(message.status))) }
    : response;
};
