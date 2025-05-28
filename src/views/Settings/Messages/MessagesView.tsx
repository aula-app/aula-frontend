import { MessageForms } from '@/components/DataForms';
import DataTable from '@/components/DataTable';
import DataTableSkeleton from '@/components/DataTable/DataTableSkeleton';
import PaginationBar from '@/components/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import { deleteMessage, getAllMessages } from '@/services/messages';
import { useAppStore } from '@/store/AppStore';
import { StatusTypes } from '@/types/Generics';
import { MessageType } from '@/types/Scopes';
import { getDataLimit } from '@/utils';
import { Drawer, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Messages" view
 * url: /settings/messages
 */

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
  const [appState, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [search_field, setSearchField] = useState('');
  const [search_text, setSearchText] = useState('');

  const [asc, setAsc] = useState(true);
  const [limit, setLimit] = useState(getDataLimit());
  const [offset, setOffset] = useState(0);
  const [orderby, setOrderby] = useState(COLUMNS[0].orderId);

  const [edit, setEdit] = useState<MessageType | boolean>(false); // false = update dialog closed ;true = new idea; MessageType = item to edit;

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const response = await getAllMessages({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      search_field,
      search_text,
      status,
    });
    if (response.error) setError(response.error);
    else {
      setMessages(response.data || []);
      setTotalMessages(response.count as number);
    }
    setLoading(false);
  }, [search_field, search_text, status, asc, limit, offset, orderby]);

  const deleteMessages = (items: Array<string>) =>
    items.map(async (message) => {
      const request = await deleteMessage(message);
      if (!request.error) onClose();
    });

  const onClose = () => {
    setEdit(false);
    fetchMessages();
  };

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0);
  }, [search_field, search_text, status]);

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.messages'), '']] });
    fetchMessages();
  }, [fetchMessages]);

  return (
    <Stack width="100%" height="100%" py={2}>
      <Stack pl={2}>
        <FilterBar
          fields={FILTER}
          scope="messages"
          onStatusChange={(newStatus) => setStatus(newStatus)}
          onFilterChange={([field, text]) => {
            setSearchField(field);
            setSearchText(text);
          }}
        />
      </Stack>
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        <DataTable
          scope="messages"
          columns={COLUMNS}
          rows={messages}
          orderAsc={asc}
          orderBy={orderby}
          setAsc={setAsc}
          setLimit={setLimit}
          setOrderby={setOrderby}
          setEdit={(text) => setEdit(text as MessageType)}
          setDelete={deleteMessages}
        />
        {isLoading && <DataTableSkeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <PaginationBar pages={Math.ceil(totalMessages / limit)} setPage={(page) => setOffset(page * limit)} />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <MessageForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default MessagesView;
