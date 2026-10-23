import { usePageTitle } from '@/hooks/usePageTitle';
import { useAppStore } from '@/store/AppStore';
import { TEST_IDS } from '@/test-ids';
import { MessageType } from '@/types/Scopes';
import ComboBox from '@/v2/components/input/ComboBox';
import SortSelect from '@/v2/components/input/SortSelect';
import TextInput from '@/v2/components/input/TextInput';
import ListPageLayout from '@/v2/components/layout/ListPageLayout';
import MessageCard from '@/v2/components/message/MessageCard';
import { getMessageVariant, MESSAGE_VARIANTS } from '@/v2/components/message/MessageCard/messageVariant';
import MessageDetail from '@/v2/components/message/MessageDetail';
import FeedbackState from '@/v2/components/ui/FeedbackState';
import Icon from '@/v2/components/ui/Icon/Icon';
import Modal from '@/v2/components/ui/Modal/Modal';
import ScopeTitle from '@/v2/components/ui/ScopeTitle';
import ScrollList from '@/v2/components/ui/ScrollList';
import useIsDrawerMode from '@/v2/hooks/useIsDrawerMode';
import { ListFilterConfig, useListFilter } from '@/v2/hooks/useListFilter';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useMessages } from './useMessages';

const messagesFilterConfig: ListFilterConfig<MessageType> = {
  searchFields: ['headline', 'body'],
  orderKeys: ['created', 'last_update', 'msg_type'],
};

/** Keeps the last defined value, so a closing modal keeps its content. */
const useLastDefined = <T,>(value: T | undefined) => {
  const [last, setLast] = useState(value);
  if (value !== undefined && value !== last) setLast(value);
  return value ?? last;
};

/** url: /messages/:message_id? */
const Messages = () => {
  const { t } = useTranslation();
  const { message_id } = useParams<{ message_id?: string }>();
  const navigate = useNavigate();
  const isDrawer = useIsDrawerMode();
  const [, dispatch] = useAppStore();
  const { messages, isLoading, error, refetch } = useMessages();
  const [types, setTypes] = useState<string[]>(MESSAGE_VARIANTS);
  const typedMessages = useMemo(
    () => messages.filter((message) => types.includes(getMessageVariant(message.msg_type))),
    [messages, types]
  );
  const typeOptions = MESSAGE_VARIANTS.map((variant) => ({
    value: variant,
    label: t(`v2.scopes.messages.types.${variant}`),
  }));
  const {
    visibleItems: visibleMessages,
    searchQuery,
    setSearchQuery,
    orderBy,
    setOrderBy,
    orderOptions,
    reversed,
    setReversed,
  } = useListFilter(typedMessages, messagesFilterConfig, 'messages');
  usePageTitle('pageTitles.messages');

  const selected = messages.find((message) => message.hash_id === message_id);
  const isMissing = !!message_id && !isLoading && !error && !selected;
  const modalMessage = useLastDefined(selected);

  const closeDetail = () => navigate('/messages');
  const handleDone = () => {
    closeDetail();
    refetch();
  };

  useEffect(() => {
    dispatch({ type: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.messages'), '/messages']] });
  }, [dispatch, t]);

  const notFound = (
    <FeedbackState
      image="/img/Paula_schlafend.svg"
      alt={t('v2.alt.sleeping')}
      title={t('v2.scopes.messages.notFound.title')}
      description={t('v2.scopes.messages.notFound.description')}
      data-testid="message-not-found-state"
    />
  );

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1">
      <div className={twMerge('flex min-h-0 min-w-0 flex-1 flex-col', !isDrawer && 'border-r border-secondary')}>
        <ListPageLayout
          header={
            <ScopeTitle
              scope="messages"
              count={visibleMessages.length}
              total={messages.length}
              defaultOpen={!!searchQuery}
              onToggle={(open) => {
                if (open) return;
                setSearchQuery('');
                setTypes(MESSAGE_VARIANTS);
              }}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <TextInput
                    dense
                    type="search"
                    label={t('v2.ui.actions.search')}
                    startAdornment={<Icon type="search" />}
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="flex-1 min-w-20"
                    data-testid={TEST_IDS.SEARCH_FIELD}
                  />
                  <SortSelect
                    options={orderOptions}
                    value={orderBy}
                    onChange={setOrderBy}
                    reversed={reversed}
                    onReversedChange={setReversed}
                    data-testid={TEST_IDS.SORT_SELECT}
                  />
                </div>
                <ComboBox
                  dense
                  label={t('v2.scopes.messages.types.label')}
                  tagsLabel={t('v2.scopes.messages.types.selected')}
                  options={typeOptions}
                  value={types}
                  onChange={setTypes}
                  className="w-full"
                  data-testid={TEST_IDS.MESSAGE_TYPE_FILTER}
                />
              </div>
            </ScopeTitle>
          }
        >
          {isLoading && (
            <p role="status">
              <span aria-hidden="true">...</span>
              <span className="sr-only">{t('status.loading')}</span>
            </p>
          )}

          {error && (
            <FeedbackState
              image="/img/Paula_unzufrieden.svg"
              alt={t('v2.alt.sad')}
              title={t(`v2.ui.error.${error}.title`)}
              description={t(`v2.ui.error.${error}.description`)}
              data-testid="messages-error-state"
            />
          )}

          {!isLoading && !error && messages.length === 0 && (
            <FeedbackState
              image="/img/Paula_schlafend.svg"
              alt={t('v2.alt.sleeping')}
              title={t('v2.ui.error.empty.title')}
              description={t('v2.ui.error.empty.description')}
              data-testid="messages-empty-state"
            />
          )}

          {!isLoading && !error && messages.length > 0 && visibleMessages.length === 0 && (
            <FeedbackState
              image="/img/Paula_zwinkernd.svg"
              alt={t('v2.alt.winking')}
              title={t('v2.ui.error.search.title')}
              description={t('v2.ui.error.search.description')}
              data-testid="messages-no-results-state"
            />
          )}

          {!isLoading && visibleMessages.length > 0 && (
            <ScrollList storageKey="messages" className="gap-1">
              {visibleMessages.map((message) => (
                <li key={message.hash_id} data-testid="message-item">
                  <MessageCard message={message} selected={message.hash_id === message_id} onArchived={refetch} />
                </li>
              ))}
            </ScrollList>
          )}
        </ListPageLayout>
      </div>

      {isDrawer ? (
        <Modal
          open={!!message_id && !isLoading && !error}
          onClose={closeDetail}
          title={!isMissing && modalMessage ? modalMessage.headline : t('v2.scopes.messages.notFound.title')}
          headless={!isMissing && !!modalMessage}
        >
          {isMissing
            ? notFound
            : modalMessage && <MessageDetail message={modalMessage} onDone={handleDone} onClose={closeDetail} />}
        </Modal>
      ) : (
        <section
          aria-label={selected?.headline ?? t('v2.scopes.messages.select')}
          data-testid="message-pane"
          className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6"
        >
          {selected && <MessageDetail message={selected} onDone={handleDone} />}
          {isMissing && notFound}
          {!message_id && (
            <p className="m-auto flex flex-col items-center gap-2 text-muted">
              <Icon type="messages" size="3rem" />
              {t('v2.scopes.messages.select')}
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default Messages;
