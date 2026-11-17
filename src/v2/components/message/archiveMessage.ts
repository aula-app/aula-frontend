import { setMessageStatus } from '@/services/messages';
import { TFunction } from 'i18next';
import { MESSAGE_STATUS } from './getInboxMessages';

/** Window event fired once a message leaves the inbox, so counts can catch up without a navigation. */
export const MESSAGES_CHANGED = 'messages-changed';

export const archiveMessage = async (hash_id: string) => {
  const response = await setMessageStatus({ message_id: hash_id, status: MESSAGE_STATUS.archived });
  if (!response.error) window.dispatchEvent(new Event(MESSAGES_CHANGED));
  return response;
};

/** Confirmation copy naming the message and where to find it once archived. */
export const archiveConfirmDescription = (t: TFunction, headline: string) =>
  t('v2.scopes.messages.archiveConfirm', { var: headline, status: t('status.archived') });
