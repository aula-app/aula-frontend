import { RoomForms } from '@/components/DataForms';
import DataTable from '@/components/DataTable';
import PaginationBar from '@/components/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import { deleteRoom, getRooms } from '@/services/rooms';
import { useAppStore } from '@/store/AppStore';
import { StatusTypes } from '@/types/Generics';
import { RoomType } from '@/types/Scopes';
import { getDataLimit } from '@/utils';
import { Drawer, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** * Renders "Rooms" view
 * url: /settings/rooms
 */

const FILTER = ['room_name', 'description_public'] as Array<keyof RoomType>;

const COLUMNS = [
  { name: 'room_name', orderId: 5 },
  { name: 'description_public', orderId: 6 },
  { name: 'status', orderId: 2 },
  { name: 'created', orderId: 4 },
  { name: 'last_update', orderId: 0 },
] as Array<{ name: keyof RoomType; orderId: number }>;

const RoomsView: React.FC = () => {
  const { t } = useTranslation();

  const [appState, dispatch] = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [totalRooms, setTotalRooms] = useState(0);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [search_field, setSearchField] = useState('');
  const [search_text, setSearchText] = useState('');

  const [asc, setAsc] = useState(true);
  const [limit, setLimit] = useState(getDataLimit());
  const [offset, setOffset] = useState(0);
  const [orderby, setOrderby] = useState(COLUMNS[0].orderId);

  //const [room_id, setRoom] = useState<string | undefined>();
  const [edit, setEdit] = useState<RoomType | boolean>(false); // false = update dialog closed ;true = new idea; RoomType = item to edit;

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const response = await getRooms({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      search_field,
      search_text,
      status,
      type: 0,
    });
    if (response.error) setError(response.error);
    else {
      setRooms(response.data || []);
      setTotalRooms(response.count as number);
    }
    setLoading(false);
  }, [search_field, search_text, status, asc, limit, offset, orderby]);

  const deleteRooms = (items: Array<string>) =>
    items.map(async (room) => {
      const request = await deleteRoom(room);
      if (!request.error) onClose();
    });

  const onClose = () => {
    setEdit(false);
    fetchRooms();
  };

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.rooms'), '']] });
    fetchRooms();
  }, [fetchRooms]);

  return (
    <Stack width="100%" height="100%" pt={2}>
      <Stack pl={2}>
        <FilterBar
          fields={FILTER}
          scope="rooms"
          onStatusChange={(newStatus) => setStatus(newStatus)}
          onFilterChange={([field, text]) => {
            setSearchField(field);
            setSearchText(text);
          }}
        />
      </Stack>
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        <DataTable
          scope="rooms"
          columns={COLUMNS}
          rows={rooms}
          orderAsc={asc}
          orderBy={orderby}
          setAsc={setAsc}
          setLimit={setLimit}
          setOrderby={setOrderby}
          setEdit={(room) => setEdit(room as RoomType | boolean)}
          setDelete={deleteRooms}
          isLoading={isLoading}
        />
        {error && <Typography>{t(error)}</Typography>}
        <PaginationBar pages={Math.ceil(totalRooms / limit)} setPage={(page) => setOffset(page * limit)} />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <RoomForms onClose={onClose} defaultValues={typeof edit !== 'boolean' ? edit : undefined} />
      </Drawer>
    </Stack>
  );
};

export default RoomsView;
