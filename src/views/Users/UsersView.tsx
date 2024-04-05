import ItemsTable from '@/components/ItemsTable';
import { UsersResponseType } from '@/types/UserTypes';
import { databaseRequest } from '@/utils/requests';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';

/** * Renders "Rooms" view
 * url: /
 */
const RoomsView = () => {
  const [users, setUsers] = useState({} as UsersResponseType);

  const usersFetch = async (page: number, limit: number) =>
    await databaseRequest('model', {
      model: 'User',
      method: 'getUsers',
      arguments: { limit: limit, offset: page * limit },
      decrypt: ['realname', 'username', 'displayname', 'email'],
    }).then((response: UsersResponseType) => {
      setUsers(response);
    });

  useEffect(() => {
    usersFetch(0, 20);
  }, []);

  return (
    <Stack direction="column" height="100%">
      <Typography variant="h4" sx={{ p: 2, pb: 0 }}>
        Users
      </Typography>

      {users.data && (
        <ItemsTable
          items={users}
          displayRows={['displayname', 'email']}
          reloadMethod={usersFetch}
          />
      )}
    </Stack>
  );
};

export default RoomsView;
