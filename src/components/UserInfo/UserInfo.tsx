import { Avatar, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { databaseRequest } from '@/utils';
import { SingleUserResponseType, UserType } from '@/types/scopes/UserTypes';
import AppIcon from '../AppIcon';

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserInfo = () => {
  const [user, setUser] = useState<UserType | null>(null);

  const getUserInfo = async () =>
    databaseRequest(
      {
        model: 'User',
        method: 'getUserBaseData',
        arguments: {},
      },
      ['user_id']
    ).then((response: SingleUserResponseType) => setUser(response.data));

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      {user && (
        <Stack alignItems="center" minHeight="fit-content" marginBottom={2}>
          <Avatar sx={{ width: 64, height: 64, mb: 1 }}>
            <AppIcon icon="avatar" size="xl" />
          </Avatar>
          <Typography sx={{ mt: 1 }} variant="h6">
            {user.username}
          </Typography>
          <Typography variant="body2">{user.displayname}</Typography>
        </Stack>
      )}
    </>
  );
};

export default UserInfo;
