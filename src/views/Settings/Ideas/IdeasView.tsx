import IdeaForms from '@/components/Data/DataForms/IdeaForms';
import DataTable from '@/components/Data/DataTable';
import DataTableSkeleton from '@/components/Data/DataTable/DataTableSkeleton';
import PaginationBar from '@/components/Data/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import {
  addIdea,
  AddIdeaArguments,
  deleteIdea,
  editIdea,
  EditIdeaArguments,
  getIdeas,
  IdeaArguments,
} from '@/services/ideas';
import { StatusTypes } from '@/types/Generics';
import { IdeaType } from '@/types/Scopes';
import { getDataLimit } from '@/utils';
import { Drawer, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Ideas" view
 * url: /settings/ideas
 */

const FILTER = ['title', 'content'] as Array<keyof IdeaType>;

const COLUMNS = [
  { name: 'title', orderId: 5 },
  { name: 'content', orderId: 6 },
  //{ name: 'custom_field1_name', orderId: 11 },
  //{ name: 'custom_field2_name', orderId: 12 },
  { name: 'user_id', orderId: 8 },
  { name: 'room_hash_id', orderId: 7 },
  { name: 'approved', orderId: 13 },
  { name: 'approval_comment', orderId: 14 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<{ name: keyof IdeaType; orderId: number }>;

const IdeasView: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<IdeaType[]>([]);
  const [totalIdeas, setTotalIdeas] = useState(0);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [search_field, setSearchField] = useState('');
  const [search_text, setSearchText] = useState('');

  const [asc, setAsc] = useState(true);
  const [limit, setLimit] = useState(getDataLimit());
  const [offset, setOffset] = useState(0);
  const [orderby, setOrderby] = useState(COLUMNS[0].orderId);

  const [edit, setEdit] = useState<string | boolean>(false); // false = update dialog closed ;true = new idea; string = item hash_id;

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    const response = await getIdeas({
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
      setIdeas(response.data || []);
      setTotalIdeas(response.count as number);
    }
    setLoading(false);
  }, [asc, limit, offset, orderby, search_field, search_text, status]);

  const onSubmit = (data: IdeaArguments) => {
    if (!edit) return;
    typeof edit === 'boolean' ? newIdea(data as AddIdeaArguments) : updateIdea(data as EditIdeaArguments);
  };

  const newIdea = async (data: AddIdeaArguments) => {
    const request = await addIdea({
      room_hash_id: data.room_hash_id,
      title: data.title,
      content: data.content,
      custom_field1: data.custom_field1,
      custom_field2: data.custom_field2,
    });
    if (!request.error) onClose();
  };

  const updateIdea = async (data: EditIdeaArguments) => {
    const idea = ideas.find((idea) => idea.hash_id === edit);
    if (!idea || !idea.hash_id) return;
    const request = await editIdea({
      idea_id: idea.hash_id,
      room_hash_id: data.room_hash_id,
      title: data.title,
      content: data.content,
      custom_field1: data.custom_field1,
      custom_field2: data.custom_field2,
    });
    if (!request.error) onClose();
  };

  const deleteIdeas = (items: Array<string>) =>
    items.map(async (idea) => {
      const request = await deleteIdea(idea);
      if (!request.error) onClose();
    });

  const onClose = () => {
    setEdit(false);
    fetchIdeas();
  };

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  return (
    <Stack width="100%" height="100%" pt={2}>
      <Stack pl={2}>
        <FilterBar
          fields={FILTER}
          scope="ideas"
          onStatusChange={(newStatus) => setStatus(newStatus)}
          onFilterChange={([field, text]) => {
            setSearchField(field);
            setSearchText(text);
          }}
        />
      </Stack>
      <Stack flex={1} sx={{ overflowY: 'auto' }}>
        {isLoading && <DataTableSkeleton />}
        {error && <Typography>{t(error)}</Typography>}
        {!isLoading && ideas.length > 0 && (
          <DataTable
            scope="ideas"
            columns={COLUMNS}
            rows={ideas}
            orderAsc={asc}
            orderBy={orderby}
            setAsc={setAsc}
            setLimit={setLimit}
            setOrderby={setOrderby}
            setEdit={setEdit}
            setDelete={deleteIdeas}
          />
        )}
        <PaginationBar pages={Math.ceil(totalIdeas / limit)} setPage={(page) => setOffset(page * limit)} />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <IdeaForms
          onClose={onClose}
          onSubmit={onSubmit}
          defaultValues={
            typeof edit !== 'boolean' ? (ideas.find((idea) => idea.hash_id === edit) as IdeaArguments) : undefined
          }
        />
      </Drawer>
    </Stack>
  );
};

export default IdeasView;
