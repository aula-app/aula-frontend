import Icon from '@/components/new/Icon';
import IconButton from '@/components/new/IconButton';
import { getUpdates } from '@/services/dashboard';
import { Badge, IconButtonProps, Skeleton } from '@mui/material';
import { t } from 'i18next';
import { forwardRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const UpdatesButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ ...restOfProps }, ref) => {
  const { pathname } = useLocation();
  const [updates, setUpdates] = useState<number>();

  const fetchUpdates = async () => {
    const response = await getUpdates();
    setUpdates(response.count || 0);
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
        <IconButton title={t('tooltips.heart')} to="/updates" {...restOfProps}>
          <Icon type="heart" size="1.5rem" />
        </IconButton>
      </Badge>
    ) : (
      <IconButton title={t('tooltips.heart')} to="/updates" {...restOfProps}>
        <Icon type="heart" size="1.5rem" />
      </IconButton>
    )
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
  );
});

UpdatesButton.displayName = 'UpdatesButton';

export default UpdatesButton;
