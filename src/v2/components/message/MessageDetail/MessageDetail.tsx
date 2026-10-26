import { TEST_IDS } from '@/test-ids';
import { MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import ArchiveButton from '@/v2/components/button/ArchiveButton';
import IconButton from '@/v2/components/button/IconButton';
import { archiveMessage } from '@/v2/components/message/archiveMessage';
import { getMessageVariant, VARIANT_STYLES } from '@/v2/components/message/MessageCard/messageVariant';
import MessageMeta from '@/v2/components/message/MessageMeta';
import { parseMessageBody } from '@/v2/components/message/parseMessageBody';
import { isActionableRequest } from '@/v2/components/message/RequestActions';
import DateText from '@/v2/components/ui/DateText';
import Icon from '@/v2/components/ui/Icon/Icon';
import Markdown from '@/v2/components/ui/Markdown';
import { summarizeVersionsJson } from '@/v2/utils/versions';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import RequestContent from './RequestContent';

interface MessageDetailProps {
  message: MessageType;
  /** Called once the message is archived or a request is resolved. */
  onDone?: () => void;
  /** Adds a close button, e.g. inside a modal. */
  onClose?: () => void;
  className?: string;
}

const detailEntries = (metadata: Record<string, string>): [string, string][] =>
  Object.entries(metadata).flatMap(([key, value]): [string, string][] =>
    key === 'versions' ? (summarizeVersionsJson(value) ?? [[key, value]]) : [[key, value]]
  );

const MessageDetail = ({ message, onDone, onClose, className }: MessageDetailProps) => {
  const { t } = useTranslation();
  const variant = getMessageVariant(message.msg_type);
  const { icon, iconClass } = VARIANT_STYLES[variant];
  const { metadata, content } = parseMessageBody(message.body);
  const canArchive = checkPermissions('messages', 'status') && !isActionableRequest(metadata);

  return (
    <article data-testid={`message-detail-${variant}`} className={twMerge('flex flex-col gap-4', className)}>
      <header className="flex items-start gap-2">
        <Icon type={icon} size="2rem" className={twMerge('shrink-0', iconClass)} />
        <h2 className="flex-1 min-w-0 text-2xl font-bold break-words">{message.headline}</h2>
        {onClose && (
          <IconButton aria-label={t('ui.common.dismiss')} onClick={onClose} className="shrink-0">
            <Icon type="close" aria-hidden="true" />
          </IconButton>
        )}
      </header>

      {variant === 'messages' && (
        <>
          <DateText withTime date={message.created} className="pl-10 text-sm" />
          {content && <Markdown className="prose px-10">{content}</Markdown>}
        </>
      )}

      {variant === 'requests' && (
        <RequestContent message={message} metadata={metadata} content={content} onDone={onDone} />
      )}

      {(variant === 'reports' || variant === 'bugs') && (
        <>
          <MessageMeta entries={detailEntries(metadata)} />
          {content && <Markdown className="prose px-4">{content}</Markdown>}
        </>
      )}

      {canArchive && (
        <ArchiveButton
          labelled
          size="1.25em"
          successMessage={t('v2.scopes.messages.archived')}
          onArchive={() => archiveMessage(message.hash_id)}
          onArchived={onDone}
          className="self-end"
          data-testid={TEST_IDS.ARCHIVE_MESSAGE_BUTTON}
        />
      )}
    </article>
  );
};

export default MessageDetail;
