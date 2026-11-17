import { setMessageStatus } from '@/services/messages';
import { TFunction } from 'i18next';
import { MESSAGE_STATUS } from './getInboxMessages';

export const archiveMessage = (hash_id: string) =>
  setMessageStatus({ message_id: hash_id, status: MESSAGE_STATUS.archived });

/** Confirmation copy naming the message and where to find it once archived. */
export const archiveConfirmDescription = (t: TFunction, headline: string) =>
  t('v2.scopes.messages.archiveConfirm', { var: headline, status: t('status.archived') });
