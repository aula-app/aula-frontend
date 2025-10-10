import { MessageForms } from '@/components/DataForms';
import SettingsView from '@/components/SettingsView';
import { useDataTableState } from '@/hooks';
import { deleteMessage, getAllMessages } from '@/services/messages';
import { useAppStore } from '@/store/AppStore';
import { MessageType } from '@/types/Scopes';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const FILTER = ['headline', 'body', 'creator_id'] as Array<keyof MessageType>;

const COLUMNS = [
  { name: 'headline', orderId: 5 },
  { name: 'body', orderId: 6 },
  { name: 'creator_id', orderId: 3 },
  { name: 'created', orderId: 4 },
  { name: 'user_hash_id', orderId: 9 },
  { name: 'target_group', orderId: 10 },
  { name: 'last_update', orderId: 0 },
] as Array<{ name: keyof MessageType; orderId: number }>;

const MessagesView: React.FC = () => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const dataTableState = useDataTableState<MessageType>({
    initialOrderBy: COLUMNS[0].orderId,
    fetchFn: getAllMessages,
    deleteFn: deleteMessage,
  });

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.messages'), '']] });
  }, [dispatch, t]);

  return (
    <SettingsView
      scope="messages"
      columns={COLUMNS}
      filterFields={FILTER}
      dataTableState={dataTableState}
      FormComponent={MessageForms as React.ComponentType<{ onClose: () => void; defaultValues?: unknown }>}
    />
  );
};

export default MessagesView;
