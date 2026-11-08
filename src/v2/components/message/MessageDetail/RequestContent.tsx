import { MessageType } from '@/types/Scopes';
import MessageMeta from '@/v2/components/message/MessageMeta';
import RequestActions, { isActionableRequest, useRequestActions } from '@/v2/components/message/RequestActions';
import DateText from '@/v2/components/ui/DateText';
import Markdown from '@/v2/components/ui/Markdown';
import { RequestType } from '@/v2/components/message/RequestActions/useRequestActions';
import { useTranslation } from 'react-i18next';

const HIDDEN_FIELDS = ['id', 'type', 'responseTo'];

interface RequestContentProps {
  message: MessageType;
  metadata: Record<string, string>;
  content: string;
  onDone?: () => void;
}

const RequestContent = ({ message, metadata, content, onDone }: RequestContentProps) => {
  const { t } = useTranslation();
  const actions = useRequestActions(message, metadata, onDone);
  const fields = Object.entries(metadata).filter(([key]) => !HIDDEN_FIELDS.includes(key));

  return (
    <>
      <MessageMeta
        entries={[
          [
            t('v2.scopes.messages.date'),
            <DateText key="date" withTime date={message.created} className="text-sm text-current" />,
          ],
          ...fields,
        ]}
      />
      {content && <Markdown className="prose px-4">{content}</Markdown>}
      {metadata.responseTo === 'requestData' && <p className="px-4">{t('requests.exportData.legacyHint')}</p>}
      {isActionableRequest(metadata) && (
        <RequestActions
          type={metadata.type as RequestType}
          pending={actions.pending}
          onConfirm={actions.confirm}
          onReject={actions.reject}
        />
      )}
    </>
  );
};

export default RequestContent;
