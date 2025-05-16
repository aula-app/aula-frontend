import AppIconButton from '@/components/AppIconButton';
import { getUpdates } from '@/services/dashboard';
import { Badge, IconButtonProps, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const UpdatesButton: React.FC<IconButtonProps> = ({ ...restOfProps }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [updates, setUpdates] = useState<number>();

  const fetchUpdates = async () => {
    const response = await getUpdates();
    if (!response.error && typeof response.count === 'number') setUpdates(response.count);
  };

  useEffect(() => {
    fetchUpdates();
  }, [pathname]);

  return typeof updates === 'number' ? (
    <Badge
      badgeContent={updates}
      color="primary"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: 'background.paper',
          top: 5,
          right: 5,
        },
      }}
      aria-label={t('ui.units.updates', { count: updates })}
    >
      <AppIconButton 
        icon="heart" 
        to="/updates" 
        aria-label={t('ui.navigation.updates')}
        title={t('ui.navigation.updates')}
        {...restOfProps} 
      />
    </Badge>
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} aria-hidden="true" />
  );
};

export default UpdatesButton;
