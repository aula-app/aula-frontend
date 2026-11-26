import { getAdminMessages, getPersonalMessages } from '@/services/messages';
import { MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';

export const MESSAGE_STATUS = { active: 1, archived: 3 } as const;
export const INBOX_STATUSES = ['active', 'archived', 'all'] as const;
export type InboxStatus = (typeof INBOX_STATUSES)[number];

const STATUS_CODES: Record<InboxStatus, (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS][]> = {
  active: [MESSAGE_STATUS.active],
  archived: [MESSAGE_STATUS.archived],
  all: Object.values(MESSAGE_STATUS),
};

/** The user's messages in a status; admins also get the ones sent to no one in particular (reports, bugs, requests). */
export const getInboxMessages = async (status: InboxStatus = 'active') => {
  const codes = STATUS_CODES[status];
  // Must match the backend, where getAdminMessages is admin-only.
  const getMessages = checkPermissions('messages', 'viewAll') ? getAdminMessages : getPersonalMessages;
  const responses = await Promise.all(codes.map((code) => getMessages(code)));

  const failed = responses.find((response) => !Array.isArray(response.data));
  if (failed) return failed;

  // The admin query returns messages sent to no one in particular regardless of status.
  const messages = new Map<string, MessageType>();
  responses
    .flatMap((response) => response.data ?? [])
    .filter((message) => codes.some((code) => code === Number(message.status)))
    .forEach((message) => messages.set(message.hash_id, message));

  return { ...responses[0], data: [...messages.values()] };
};
