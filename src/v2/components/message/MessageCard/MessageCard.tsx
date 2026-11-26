import { MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import ArchiveButton from '@/v2/components/button/ArchiveButton';
import { archiveMessage } from '@/v2/components/message/archiveMessage';
import { parseMessageBody } from '@/v2/components/message/parseMessageBody';
import { isActionableRequest } from '@/v2/components/message/RequestActions';
import Link from '@/v2/components/navigation/Link';
import DateText from '@/v2/components/ui/DateText';
import Icon from '@/v2/components/ui/Icon/Icon';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { getMessageVariant, VARIANT_STYLES } from './messageVariant';

interface MessageCardProps {
  message: MessageType;
  /** Marks the card whose message is open beside the list. */
  selected?: boolean;
  /** Called once the message is archived. */
  onArchived?: () => void;
}

const MessageCard = ({ message, selected = false, onArchived }: MessageCardProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const variant = getMessageVariant(message.msg_type);
  const { icon, iconClass, color, hover } = VARIANT_STYLES[variant];
  const canArchive =
    checkPermissions('messages', 'status') && !isActionableRequest(parseMessageBody(message.body).metadata);

  return (
    <article
      aria-labelledby={titleId}
      data-testid={`message-${variant}-${message.hash_id}`}
      className={twMerge(
        'flex items-stretch gap-1 min-h-16 rounded-2xl',
        selected && 'outline-2 outline-offset-2 outline-foreground'
      )}
    >
      <div className={twMerge('flex shrink-0 items-center justify-center rounded-l-2xl px-4', color)}>
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
          !canArchive && 'rounded-r-2xl pr-6'
        )}
      >
        <h2 id={titleId} className="truncate text-lg font-semibold">
          {message.headline}
        </h2>
        {message.created && (
          <p className="text-xs">
            {t('v2.scopes.messages.sentOn')}{' '}
            <DateText withTime date={message.created} className="font-bold text-current" />
          </p>
        )}
      </Link>
      {canArchive && (
        <div className={twMerge('flex shrink-0 items-center justify-center rounded-r-2xl px-3', color)}>
          <ArchiveButton
            subject={message.headline}
            successMessage={t('v2.scopes.messages.archived')}
            onArchive={() => archiveMessage(message.hash_id)}
            onArchived={onArchived}
          />
        </div>
      )}
    </article>
  );
};

export default MessageCard;
