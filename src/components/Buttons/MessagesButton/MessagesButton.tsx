import AppIconButton from '@/components/AppIconButton';
import { getAnnouncements } from '@/services/announcements';
import { getMessages } from '@/services/messages';
import { Badge, IconButtonProps, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props extends IconButtonProps {
  target: string;
}

const MessagesButton: React.FC<Props> = ({ target, disabled = false, ...restOfProps }) => {
  const [messages, setMessages] = useState<number>();
  const [reports, setReports] = useState<number>();

  const fetchMessages = async () => {
    const response = await getMessages();
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
  }, []);

  return typeof messages === 'number' && typeof reports === 'number' ? (
    <Badge badgeContent={messages + reports} color="primary">
      <AppIconButton icon="message" to="/messages" sx={{ p: 0 }} {...restOfProps} />
    </Badge>
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
  );
};

export default MessagesButton;
