import { databaseRequest } from '@/utils';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import AppIcon from '../AppIcon';

interface Props {
  id: number;
  size?: 'small' | 'large';
  update: boolean;
}

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserAvatar = ({ id, size, update }: Props) => {
  const [userAvatar, setUserAvatar] = useState<string>('');

  const currentSize = size === 'small' ? 32 : size === 'large' ? 128 : 56;

  const downloadUserAvatar = () => {
    if (!id) return;
    databaseRequest({
      model: 'Media',
      method: 'userAvatar',
      arguments: {
        user_id: id,
      },
    }).then((result: any) => {
      if (!result || !result.success) return;
      setUserAvatar(result.data[0].filename);
    });
  };

  useEffect(() => {
    console.log("UPDATE", update)
    downloadUserAvatar();
  }, [update]);

  return (
    <Avatar
      sx={{
        width: currentSize,
        height: currentSize,
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
