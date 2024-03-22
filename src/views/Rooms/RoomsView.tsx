import { RoomsResponseType } from '@/types/RoomTypes';
import { databaseRequest } from '@/utils/requests';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/** * Renders "Rooms" view
 * url: /
 */
const RoomsView = () => {
  const params = useParams();
  const [rooms, setRooms] = useState({} as RoomsResponseType);
  const columns: GridColDef[] = [
    { field: 'room_name', headerName: 'Name', width: 260 },
    { field: 'description_internal', headerName: 'Internal Description', width: 300 },
    { field: 'description_public', headerName: 'Public Description', width: 300 },
  ];

  const roomsFetch = async () =>
    await databaseRequest('model', {
      model: 'Room',
      method: 'getRoomBaseData',
      arguments: { room_id: Number(params['room_id']) },
      decrypt: ['content', 'displayname'],
    }).then((response: RoomsResponseType) => {
      setRooms(response)
      console.log(response)
    });

  useEffect(() => {
    roomsFetch();
  }, []);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h4">Rooms</Typography>

      {rooms.data && (
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={rooms.data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20]}
            checkboxSelection
          />
        </div>
      )}
    </Stack>
  );
};

export default RoomsView;
