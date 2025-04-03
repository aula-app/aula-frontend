import AppIconButton from '@/components/AppIconButton';
import { getAnnouncements } from '@/services/announcements';
import { getPersonalMessages } from '@/services/messages';
import { Badge, IconButtonProps, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MessagesButton: React.FC<IconButtonProps> = ({ ...restOfProps }) => {
  const { pathname } = useLocation();
  const [messages, setMessages] = useState<number>();
  const [reports, setReports] = useState<number>();

  const fetchMessages = async () => {
    const response = await getPersonalMessages();
    if (!response.error) setMessages(response.data?.length || 0);
  };

  const fetchReports = async () => {
    const response = await getAnnouncements({
      offset: 0,
      limit: 0,
    });
    if (!response.error) setReports(response.data?.length || 0);
  };

  useEffect(() => {
    fetchMessages();
    fetchReports();
  }, [pathname]);

  return typeof messages === 'number' && typeof reports === 'number' ? (
    <Badge
      badgeContent={messages + reports}
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: 'background.paper',
          top: 5,
          right: 5,
        },
      }}
    >
      <AppIconButton icon="message" to="/messages" {...restOfProps} />
    </Badge>
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
  );
};

export default MessagesButton;
