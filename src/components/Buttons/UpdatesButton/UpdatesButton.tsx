import AppIconButton from '@/components/AppIconButton';
import { getUpdates } from '@/services/dashboard';
import { Badge, IconButtonProps, Skeleton } from '@mui/material';
import { forwardRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { t } from 'i18next';

const UpdatesButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ ...restOfProps }, ref) => {
  const { pathname } = useLocation();
  const [updates, setUpdates] = useState<number>();

  const fetchUpdates = async () => {
    const response = await getUpdates();
    if (!response.error && typeof response.count === 'number') setUpdates(response.count);
  };

  useEffect(() => {
    fetchUpdates();
  }, [pathname]);

  return typeof updates === 'number' ? (
    updates !== 0 ? (
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
      >
        <AppIconButton ref={ref} icon="heart" title={t('tooltips.heart')} to="/updates" {...restOfProps} />
      </Badge>
    ) : (
      <AppIconButton ref={ref} icon="heart" title={t('tooltips.heart')} to="/updates" {...restOfProps} />
    )
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
  );
});

UpdatesButton.displayName = 'UpdatesButton';

export default UpdatesButton;
