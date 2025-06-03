import { BoxForms } from '@/components/DataForms';
import DataTable from '@/components/DataTable';
import PaginationBar from '@/components/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import SelectRoom from '@/components/SelectRoom';
import { BoxArguments, deleteBox, getBoxes } from '@/services/boxes';
import { useAppStore } from '@/store/AppStore';
import { StatusTypes } from '@/types/Generics';
import { BoxType } from '@/types/Scopes';
import { getDataLimit } from '@/utils';
import { Drawer, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Boxes" view
 * url: /settings/boxes
 */

const FILTER = ['name', 'description_public', 'description_internal'] as Array<keyof BoxType>;

const COLUMNS = [
  { name: 'name', orderId: 5 },
  { name: 'description_public', orderId: 6 },
  { name: 'description_internal', orderId: 7 },
  { name: 'room_hash_id', orderId: 8 },
  { name: 'phase_id', orderId: 9 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<{ name: keyof BoxArguments; orderId: number }>;

const BoxesView: React.FC = () => {
  const { t } = useTranslation();

  const [appState, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<BoxType[]>([]);
  const [totalBoxes, setTotalBoxes] = useState(0);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [search_field, setSearchField] = useState('');
  const [search_text, setSearchText] = useState('');

  const [asc, setAsc] = useState(true);
  const [limit, setLimit] = useState(getDataLimit());
  const [offset, setOffset] = useState(0);
  const [orderby, setOrderby] = useState(COLUMNS[0].orderId);
  const [room_id, setRoom] = useState<string>('');

  const [edit, setEdit] = useState<BoxType | boolean>(false); // false = update dialog closed ;true = new idea; BoxType = item to edit;

  const fetchBoxes = useCallback(async () => {
    setLoading(true);
    const response = await getBoxes({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      search_field,
      search_text,
      status,
      room_id,
    });
    if (response.error) setError(response.error);
    else {
      setBoxes(response.data || []);
      setTotalBoxes(response.count as number);
    }
    setLoading(false);
  }, [search_field, search_text, status, asc, limit, offset, orderby, room_id]);

  const deleteBoxes = (items: Array<string>) =>
    items.map(async (box) => {
      const request = await deleteBox(box);
      if (!request.error) onClose();
    });

  const onClose = () => {
    setEdit(false);
    fetchBoxes();
  };

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.boxes'), '']] });
    fetchBoxes();
  }, [fetchBoxes]);

  return (
    <Stack width="100%" height="100%" pt={2}>
      <Stack pl={2}>
        <FilterBar
          fields={FILTER}
          scope="boxes"
          onStatusChange={(newStatus) => setStatus(newStatus)}
          onFilterChange={([field, text]) => {
            setSearchField(field);
            setSearchText(text);
          }}
        >
          <SelectRoom room={room_id} setRoom={setRoom} />
        </FilterBar>
      </Stack>
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        <DataTable
          scope="boxes"
          columns={COLUMNS}
          rows={boxes}
          orderAsc={asc}
          orderBy={orderby}
          setAsc={setAsc}
          setLimit={setLimit}
          setOrderby={setOrderby}
          setEdit={(box) => setEdit(box as BoxType | boolean)}
          setDelete={deleteBoxes}
          isLoading={isLoading}
        />
        {error && <Typography>{t(error)}</Typography>}
        <PaginationBar pages={Math.ceil(totalBoxes / limit)} setPage={(page) => setOffset(page * limit)} />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <BoxForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default BoxesView;
