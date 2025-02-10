import { getAvatar } from '@/services/media';
import { Avatar, AvatarProps } from '@mui/material';
import { useEffect, useState } from 'react';
import AppIcon from '../AppIcon';

interface Props extends AvatarProps {
  id: string;
  size?: number;
}

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserAvatar = ({ id, size = 32, sx, ...restOfProps }: Props) => {
  const [userAvatar, setUserAvatar] = useState<string>('');
  const downloadUserAvatar = async () => {
    const response = await getAvatar(id);
    if (!response.data) return;
    if (response.data.length > 0) setUserAvatar(response.data[0].filename);
  };

  useEffect(() => {
    downloadUserAvatar();
  }, [id]);

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        fontSize: '3rem',
        ...sx,
      }}
      alt="User avatar"
      src={`/files/${userAvatar}` || ''}
      {...restOfProps}
    >
      {!userAvatar && <AppIcon icon="avatar" />}
    </Avatar>
  );
};

export default UserAvatar;
