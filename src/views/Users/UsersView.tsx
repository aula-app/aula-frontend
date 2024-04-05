import { UsersResponseType } from '@/types/UserTypes';
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
  const [users, setUsers] = useState({} as UsersResponseType);
  const columns: GridColDef[] = [
    { field: 'room_name', headerName: 'Name', width: 260 },
    { field: 'description_internal', headerName: 'Internal Description', width: 300 },
    { field: 'description_public', headerName: 'Public Description', width: 300 },
  ];

  const usersFetch = async () =>
    await databaseRequest('model', {
      model: 'User',
      method: 'getUsers',
      arguments: { limit: 20, offset: 20 },
      decrypt: ['realname', 'username', 'displayname', 'email'],
    }).then((response: UsersResponseType) => {
      setUsers(response);
    });

  useEffect(() => {
    usersFetch();
  }, []);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h4">Rooms</Typography>

      {users.data && (
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={users.data}
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
