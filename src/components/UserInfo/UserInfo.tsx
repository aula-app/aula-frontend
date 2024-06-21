import { Avatar, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { localStorageGet } from '@/utils';
import { parseJwt } from '@/utils/jwt';
import { databaseRequest } from '@/utils/requests';
import { SingleUserResponseType, UserType } from '@/types/UserTypes';

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserInfo = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);

  const getUserInfo = async () =>
    databaseRequest('model', {
      model: 'User',
      method: 'getUserBaseData',
      arguments: { user_id: jwt_payload.user_id },
    }).then((response: SingleUserResponseType) => setUser(response.data));

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <Stack alignItems="center" minHeight="fit-content" marginBottom={2}>
      {user && (
        <>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              fontSize: '3rem',
            }}
            alt={user.displayname || 'User Avatar'}
            src={user.avatar || '/img/Aula_Logo_Kopf.svg'}
          />
          <Typography sx={{ mt: 1 }} variant="h6">
            {user.username}
          </Typography>
          <Typography variant="body2">{user.displayname}</Typography>
        </>
      )}
    </Stack>
  );
};

export default UserInfo;
