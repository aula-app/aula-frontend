import { getSelf } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar';

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserInfo = () => {
  const [user, setUser] = useState<UserType | null>(null);

  const getUserInfo = async () => {
    const response = await getSelf();
    if (response.data) setUser(response.data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <>
      {user && (
        <Stack alignItems="center" minHeight="fit-content" my={2}>
          <UserAvatar id={user.hash_id} size={80} />
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
