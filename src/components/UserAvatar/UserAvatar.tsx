import { Avatar, Stack, Typography } from '@mui/material';
import AppIcon from '../AppIcon';
import { useEffect, useState } from 'react';
import { databaseRequest } from '@/utils';
import { SingleUserResponseType } from '@/types/RequestTypes';

interface Props {
  id: number;
}

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserAvatar = ({ id }: Props) => {
  const [userAvatar, setUserAvatar] = useState<string>('');

  const downloadUserAvatar = () => {
    databaseRequest({
      model: 'Media',
      method: 'userAvatar',
      arguments: {
        user_id: id,
      },
    }).then((res: any) => {
      setUserAvatar(res.data[0].filename);
    });
  };

  useEffect(() => {
    downloadUserAvatar();
  }, []);

  return (
    <Avatar
      sx={{
        width: 128,
        height: 128,
        fontSize: '3rem',
      }}
      alt="User avatar"
      src={`${import.meta.env.VITE_APP_API_URL}/files/${userAvatar}` || ''}
    >
      {!userAvatar && <AppIcon icon="avatar" size="xl" />}
    </Avatar>
  );
};

export default UserAvatar;
