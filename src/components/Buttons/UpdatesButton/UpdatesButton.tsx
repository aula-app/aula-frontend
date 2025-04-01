import AppIconButton from '@/components/AppIconButton';
import { getUpdates } from '@/services/dashboard';
import { Badge, IconButtonProps, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Props extends IconButtonProps {
  target: string;
}

const UpdatesButton: React.FC<Props> = ({ target, disabled = false, ...restOfProps }) => {
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
    <Badge badgeContent={updates} color="primary" sx={{ mx: 1 }}>
      <AppIconButton icon="heart" to="/updates" sx={{ p: 0 }} {...restOfProps} />
    </Badge>
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
  );
};

export default UpdatesButton;
