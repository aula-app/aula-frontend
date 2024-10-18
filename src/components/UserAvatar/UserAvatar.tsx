import { localStorageGet, databaseRequest } from '@/utils';
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
  const api_url = localStorageGet('api_url');

  const currentSize = size === 'small' ? 32 : size === 'large' ? 128 : 56;

  const downloadUserAvatar = () => {
    if (!id) return;
    databaseRequest({
      model: 'Media',
      method: 'userAvatar',
      arguments: {
        user_id: id,
      },
    }).then((response: any) => {
      if (!response.success) return;
      if (response.data.length > 0) setUserAvatar(response.data[0].filename);
    });
  };

  useEffect(() => {
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
      src={`${api_url}/files/${userAvatar}` || ''}
    >
      {!userAvatar && <AppIcon icon="avatar" size="xl" />}
    </Avatar>
  );
};

export default UserAvatar;
