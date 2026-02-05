import { getPersonalMessages } from '@/services/messages';
import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Chip from '../Chip/Chip';

const MessageBadge = () => {
  const { pathname } = useLocation();
  const [updates, setUpdates] = useState<number>();

  const fetchMessages = async () => {
    const response = await getPersonalMessages();
    setUpdates(response.data?.length || 0);
  };

  useEffect(() => {
    fetchMessages();
  }, [pathname]);

  return typeof updates === 'number' ? (
    updates !== 0 ? (
      <Chip className="bg-emerald-200">{updates}</Chip>
    ) : null
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
  );
};

export default MessageBadge;
