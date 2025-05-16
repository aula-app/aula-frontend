import { getAvatar } from '@/services/media';
import { getUser } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { Avatar, AvatarProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppIcon from '../AppIcon';
import { localStorageGet } from '@/utils';

interface Props extends AvatarProps {
  id: string;
  size?: number;
  userName?: string; // Optional prop to pass the username directly for better performance
  displayName?: string; // Optional prop to pass the displayname directly for better performance
}

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserAvatar = ({ id, size = 32, userName, displayName, sx, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const api_url = localStorageGet('api_url');
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [userData, setUserData] = useState<{displayName?: string, userName?: string}>({
    displayName,
    userName
  });

  const downloadUserAvatar = async () => {
    const response = await getAvatar(id);
    if (!response.data) return;
    if (response.data.length > 0) setUserAvatar(response.data[0].filename);
  };

  const fetchUserData = async () => {
    // Only fetch user data if not provided through props
    if (!userData.displayName && !userData.userName) {
      try {
        const response = await getUser(id);
        if (response.data) {
          setUserData({
            displayName: response.data.displayname,
            userName: response.data.username
          });
        }
      } catch (error) {
        console.error('Error fetching user data for avatar:', error);
      }
    }
  };

  useEffect(() => {
    downloadUserAvatar();
    fetchUserData();
  }, [id]);

  // Generate a descriptive alt text
  const getAltText = () => {
    if (userData.displayName) {
      return t('accessibility.aria.userAvatar', { name: userData.displayName });
    } else if (userData.userName) {
      return t('accessibility.aria.userAvatar', { name: userData.userName });
    } else {
      return t('accessibility.aria.genericUserAvatar');
    }
  };

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        fontSize: '3rem',
        ...sx,
      }}
      alt={getAltText()}
      src={`${api_url}/files/${userAvatar}` || ''}
      {...restOfProps}
    >
      {!userAvatar && <AppIcon icon="avatar" />}
    </Avatar>
  );
};

export default UserAvatar;
