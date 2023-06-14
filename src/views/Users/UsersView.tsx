import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AppLink } from '../../components';
import { useEffect, useState } from 'react';


/** * Renders "Welcome" view
 * url: /
 */
const UsersView = () => {
  const [data, setData] = useState([] as any[]);
  const columns:GridColDef[] = [
    { field: 'realname', headerName: 'Real Name', width: 260},
    { field: 'username', headerName: 'username', width: 300},
  ] 

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/api/users.php"
        )
      ).json();

      // set state when the data received
      setData(data)
    };

    dataFetch();
    },[]);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h4">Users</Typography>

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

export default UsersView;
