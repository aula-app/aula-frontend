import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AppLink } from '../../components';
import { localStorageGet } from '../../utils/localStorage';
import { useEffect, useState } from 'react';


/** * Renders "User" view
 * url: /user
 */
const UserView = () => {
  const [data, setData] = useState([] as any[]);
  const jwt_token = localStorageGet('token');

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          "/api/controllers/user.php",
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwt_token
            },
         }
        )
      ).json();

      console.log(data)
      setData(data.data)
    };

    dataFetch();
    },[]);

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h4">User</Typography>

      <div style={{ width: '100%' }}>
      </div>
    </Stack>
  );
};

export default UserView;
