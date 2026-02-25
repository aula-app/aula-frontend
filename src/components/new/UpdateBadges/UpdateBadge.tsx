import { getUpdates } from '@/services/dashboard';
import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Chip from '../Chip/Chip';

const UpdateBadge = () => {
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
      <Chip className="bg-theme-pink-light">{updates}</Chip>
    ) : null
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
  );
};

export default UpdateBadge;
