import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { localStorageGet } from '@/utils/localStorage';
import { useEffect, useState } from 'react';
import { databaseRequest } from '@/utils/requests';
import { parseJwt } from '@/utils/jwt';
import { UserResponseType, UserType } from '@/types/UserTypes';

/** * Renders "User" view
 * url: /user
 */
const UserView = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);

  const getUserInfo = async () =>
    databaseRequest('model', {
      model: 'User',
      method: 'getUserBaseData',
      arguments: { user_id: jwt_payload.user_id },
      decrypt: ['displayname', 'username', 'email', 'about_me'],
    }).then((response: UserResponseType) => setUser(response.data));

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Stack width="100%" height="100%" overflow="hidden">
      <Typography variant="h4">User</Typography>
      {user && (
        <Stack p={2}>
          <p>{user.username}</p>
          <p>{user.displayname}</p>
          <p>{user.email}</p>
          <p>{user.about_me}</p>
        </Stack>
      )}
    </Stack>
  );
};

export default UserView;
