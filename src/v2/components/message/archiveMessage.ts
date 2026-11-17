import { setMessageStatus } from '@/services/messages';
import { TFunction } from 'i18next';
import { InboxStatus, MESSAGE_STATUS } from './getInboxMessages';

/** Window event fired once a message enters or leaves the inbox, so counts can catch up without a navigation. */
export const MESSAGES_CHANGED = 'messages-changed';

const setStatus = async (hash_id: string, status: InboxStatus) => {
  const response = await setMessageStatus({ message_id: hash_id, status: MESSAGE_STATUS[status] });
  if (!response.error) window.dispatchEvent(new Event(MESSAGES_CHANGED));
  return response;
};

export const archiveMessage = (hash_id: string) => setStatus(hash_id, 'archived');

export const restoreMessage = (hash_id: string) => setStatus(hash_id, 'active');

/** Confirmation copy naming the message and where to find it once archived. */
export const archiveConfirmDescription = (t: TFunction, headline: string) =>
  t('v2.scopes.messages.archiveConfirm', { var: headline, status: t('status.archived') });
