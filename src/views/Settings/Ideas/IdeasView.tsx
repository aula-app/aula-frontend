import AddBoxesButton from '@/components/Buttons/AddBoxes';
import AddCategoriesButton from '@/components/Buttons/AddCategories';
import { AddCategoryRefProps } from '@/components/Buttons/AddCategories/AddCategoriesButton';
import { IdeaForms } from '@/components/DataForms';
import DataTable from '@/components/DataTable';
import DataTableSkeleton from '@/components/DataTable/DataTableSkeleton';
import PaginationBar from '@/components/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import {
  addIdea,
  AddIdeaArguments,
  deleteIdea,
  editIdea,
  EditIdeaArguments,
  getIdeas,
  getIdeasByBox,
  IdeaArguments,
} from '@/services/ideas';
import { StatusTypes } from '@/types/Generics';
import { IdeaType } from '@/types/Scopes';
import { getDataLimit } from '@/utils';
import { Drawer, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useRef, useState } from 'react';
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

  const addCategory = useRef<AddCategoryRefProps>(null);

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
  const [room_id, setRoom] = useState<string>('all');
  const [box_id, setBox] = useState<string>('all');

  const [edit, setEdit] = useState<IdeaType | boolean>(false); // false = update dialog closed ;true = new idea; IdeaType = item to edit;

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    const response = box_id === 'all' ? await fetchAllIdeas() : await fetchIdeasByBox();
    if (response.error) setError(response.error);
    else {
      setIdeas(response.data || []);
      setTotalIdeas(response.count as number);
    }
    setLoading(false);
  }, [asc, limit, offset, orderby, search_field, search_text, status, room_id, box_id]);

  const fetchAllIdeas = async () =>
    await getIdeas({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      search_field,
      search_text,
      status,
      room_id,
    });

  const fetchIdeasByBox = async () =>
    await getIdeasByBox({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      search_field,
      search_text,
      status,
      room_id,
      topic_id: box_id,
    });

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

  const extraTools = ({ items }: { items: Array<string> }) => (
    <>
      <AddBoxesButton ideas={items} disabled={items.length === 0} />
    </>
  );

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
        <DataTable
          scope="ideas"
          columns={COLUMNS}
          rows={ideas}
          orderAsc={asc}
          orderBy={orderby}
          setAsc={setAsc}
          setLimit={setLimit}
          setOrderby={setOrderby}
          setEdit={(idea) => setEdit(idea as IdeaType)}
          setDelete={deleteIdeas}
          extraTools={extraTools}
        />
        {isLoading && <DataTableSkeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <PaginationBar pages={Math.ceil(totalIdeas / limit)} setPage={(page) => setOffset(page * limit)} />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <IdeaForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default IdeasView;
