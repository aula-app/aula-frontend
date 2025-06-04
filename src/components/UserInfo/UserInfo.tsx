import { getSelf } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar';
import LocaleSwitch from '../LocaleSwitch';

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
    <Stack m={2}>
      {user && (
        <Stack direction="row" alignItems="center" minHeight="fit-content" gap={2}>
          <UserAvatar id={user.hash_id} size={52} />
          <Stack flex={1}>
            <Typography sx={{ mt: 1 }} variant="h3" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
              {user.username}
            </Typography>
            <Typography variant="body2" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
              {user.displayname}
            </Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default UserInfo;
