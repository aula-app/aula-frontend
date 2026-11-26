import { MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import ArchiveButton from '@/v2/components/button/ArchiveButton';
import RestoreButton from '@/v2/components/button/RestoreButton';
import { archiveConfirmDescription, archiveMessage, restoreMessage } from '@/v2/components/message/archiveMessage';
import { MESSAGE_STATUS } from '@/v2/components/message/getInboxMessages';
import { parseMessageBody } from '@/v2/components/message/parseMessageBody';
import { isActionableRequest } from '@/v2/components/message/RequestActions';
import Link from '@/v2/components/navigation/Link';
import DateText from '@/v2/components/ui/DateText';
import Icon from '@/v2/components/ui/Icon/Icon';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { ARCHIVED_STYLES, getMessageVariant, VARIANT_STYLES } from './messageVariant';

interface MessageCardProps {
  message: MessageType;
  /** Marks the card whose message is open beside the list. */
  selected?: boolean;
  /** Called once the message is archived or restored. */
  onChanged?: () => void;
}

const MessageCard = ({ message, selected = false, onChanged }: MessageCardProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const variant = getMessageVariant(message.msg_type);
  const isArchived = Number(message.status) === MESSAGE_STATUS.archived;
  const { icon, iconClass, color: typeColor } = VARIANT_STYLES[variant];
  const { color, hover } = isArchived ? ARCHIVED_STYLES : VARIANT_STYLES[variant];
  const canChangeStatus = checkPermissions('messages', 'status');
  const canArchive =
    canChangeStatus &&
    Number(message.status) === MESSAGE_STATUS.active &&
    !isActionableRequest(parseMessageBody(message.body).metadata);
  const canRestore = canChangeStatus && isArchived;

  return (
    <article
      aria-labelledby={titleId}
      data-testid={`message-${variant}-${message.hash_id}`}
      className={twMerge(
        'flex items-stretch gap-1 min-h-16 rounded-2xl',
        selected && 'outline-2 outline-offset-2 outline-foreground'
      )}
    >
      <div className={twMerge('flex shrink-0 items-center justify-center rounded-l-2xl px-4', typeColor)}>
        <Icon type={icon} size="2rem" className={iconClass} />
      </div>
      <Link
        to={`/messages/${message.hash_id}`}
        aria-current={selected ? 'page' : undefined}
        className={twMerge(
          'flex min-w-0 flex-1 flex-col justify-center px-3 py-2 rounded-none',
          'hover:no-underline transition-colors duration-150',
          color,
          hover,
          !canArchive && !canRestore && 'rounded-r-2xl pr-6'
        )}
      >
        <h2 id={titleId} className="truncate text-lg font-semibold">
          {message.headline}
        </h2>
        {(message.created || isArchived) && (
          <p className="flex flex-wrap items-center gap-x-2 text-xs">
            {message.created && (
              <span>
                {t('v2.scopes.messages.sentOn')}{' '}
                <DateText withTime date={message.created} className="font-bold text-current" />
              </span>
            )}
            {isArchived && (
              <span className="inline-flex items-center gap-1 font-semibold">
                <Icon type="archive" size="1em" aria-hidden="true" />
                {t('status.archived')}
              </span>
            )}
          </p>
        )}
      </Link>
      {(canArchive || canRestore) && (
        <div className={twMerge('flex shrink-0 items-center justify-center rounded-r-2xl px-3', color)}>
          {canArchive ? (
            <ArchiveButton
              subject={message.headline}
              confirmDescription={archiveConfirmDescription(t, message.headline)}
              successMessage={t('v2.scopes.messages.archived')}
              onArchive={() => archiveMessage(message.hash_id)}
              onArchived={onChanged}
            />
          ) : (
            <RestoreButton
              subject={message.headline}
              successMessage={t('v2.scopes.messages.restored')}
              onRestore={() => restoreMessage(message.hash_id)}
              onRestored={onChanged}
            />
          )}
        </div>
      )}
    </article>
  );
};

export default MessageCard;
