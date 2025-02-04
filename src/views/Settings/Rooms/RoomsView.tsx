import RoomForms from '@/components/Data/DataForms/RoomForms';
import DataTable from '@/components/Data/DataTable';
import DataTableSkeleton from '@/components/Data/DataTable/DataTableSkeleton';
import PaginationBar from '@/components/Data/DataTable/PaginationBar';
import FilterBar from '@/components/FilterBar';
import { addRoom, deleteRoom, editRoom, EditRoomArguments, getRooms, RoomArguments } from '@/services/rooms';
import { StatusTypes } from '@/types/Generics';
import { RoomType } from '@/types/Scopes';
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
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [totalRooms, setTotalRooms] = useState(0);

  const [status, setStatus] = useState<StatusTypes>(1);
  const [filter, setFilter] = useState<[string, string]>(['', '']);

  const [asc, setAsc] = useState(true);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [orderby, setOrderby] = useState(COLUMNS[0].orderId);

  const [room_id, setRoom] = useState<string | undefined>();
  const [edit, setEdit] = useState<string | boolean>(false); // false = update dialog closed ;true = new idea; string = item hash_id;

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const response = await getRooms({
      asc: Number(asc) as 0 | 1,
      limit,
      offset,
      orderby,
      search_field: filter[0],
      search_text: filter[1],
      status,
    });
    if (response.error) setError(response.error);
    else {
      setRooms(response.data || []);
      setTotalRooms(response.count as number);
    }
    setLoading(false);
  }, [JSON.stringify(filter), status, asc, limit, offset, orderby, room_id]);

  const onSubmit = (data: RoomArguments) => {
    if (!edit) return;
    typeof edit === 'boolean' ? newRoom(data) : updateRoom(data as EditRoomArguments);
  };

  const newRoom = async (data: RoomArguments) => {
    const request = await addRoom({
      room_name: data.room_name,
      description_internal: data.description_internal,
      description_public: data.description_public,
      internal_info: data.internal_info,
      phase_duration_1: data.phase_duration_1,
      phase_duration_2: data.phase_duration_2,
      phase_duration_3: data.phase_duration_3,
      phase_duration_4: data.phase_duration_4,
      status: data.status,
    });
    if (!request.error) onClose();
  };

  const updateRoom = async (data: EditRoomArguments) => {
    const room = rooms.find((room) => room.hash_id === edit);
    if (!room || !room.hash_id) return;
    const request = await editRoom({
      room_id: room.hash_id,
      room_name: data.room_name,
      description_internal: data.description_internal,
      description_public: data.description_public,
      internal_info: data.internal_info,
      phase_duration_1: data.phase_duration_1,
      phase_duration_2: data.phase_duration_2,
      phase_duration_3: data.phase_duration_3,
      phase_duration_4: data.phase_duration_4,
      status: data.status,
    });
    if (!request.error) onClose();
  };

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
    fetchRooms();
  }, [fetchRooms]);

  return (
    <Stack width="100%" height="100%" py={2}>
      <Stack pl={2}>
        <FilterBar
          fields={FILTER}
          scope="rooms"
          onStatusChange={(newStatus) => setStatus(newStatus)}
          onFilterChange={(newFilter) => setFilter(newFilter)}
        />
      </Stack>
      <Stack flex={1} gap={2} sx={{ overflowY: 'auto' }}>
        {isLoading && <DataTableSkeleton />}
        {error && <Typography>{t(error)}</Typography>}
        {!isLoading && rooms.length > 0 && (
          <DataTable
            scope="rooms"
            columns={COLUMNS}
            rows={rooms}
            orderAsc={asc}
            orderBy={orderby}
            setAsc={setAsc}
            setLimit={setLimit}
            setOrderby={setOrderby}
            setEdit={setEdit}
            setDelete={deleteRooms}
          />
        )}
        <PaginationBar pages={Math.ceil(totalRooms / limit)} setPage={(page) => setOffset(page * limit)} />
      </Stack>
      <Drawer anchor="bottom" open={!!edit} onClose={onClose} sx={{ overflowY: 'auto' }}>
        <RoomForms
          onClose={onClose}
          onSubmit={onSubmit}
          defaultValues={
            typeof edit !== 'boolean' ? (rooms.find((room) => room.hash_id === edit) as RoomArguments) : undefined
          }
        />
      </Drawer>
    </Stack>
  );
};

export default RoomsView;
