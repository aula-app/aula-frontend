import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AppLink } from '../../components';
import { useEffect, useState } from 'react';


/** * Renders "RoomSetting" view
 * url: /
 */
const RoomSettingView = () => {
  const [data, setData] = useState([] as any[]);
  const columns:GridColDef[] = [
    { field: 'room_name', headerName: 'Name', width: 260},
    { field: 'description_internal', headerName: 'Internal Description', width: 300},
    { field: 'description_public', headerName: 'Public Description', width: 300},
  ]

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          import.meta.env.VITE_APP_API_URL + "/api/controllers/rooms.php"
        )
      ).json();

      // set state when the data received
      setData(data.data)
    };

    dataFetch();
    },[]);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h4">Rooms</Typography>

      <div style={{ width: '100%' }}>
        <DataGrid
          rows={data}
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
    </Stack>
  );
};

export default RoomSettingView;
