import { getAvatar } from '@/services/media';
import { Avatar, AvatarProps } from '@mui/material';
import { useEffect, useState } from 'react';
import AppIcon from '../AppIcon';
import { useTranslation } from 'react-i18next';

interface Props extends AvatarProps {
  id: string;
  size?: number;
}

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserAvatar = ({ id, size = 32, sx, ...restOfProps }: Props) => {
  const { t } = useTranslation();
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
      {...restOfProps}
      sx={{
        width: size,
        height: size,
        fontSize: '3rem',
        ...sx,
      }}
      alt={t('user.avatar', { id: id })}
      src={`/files/${userAvatar}` || ''}
    >
      {!userAvatar && <AppIcon icon="avatar" />}
    </Avatar>
  );
};

export default UserAvatar;
