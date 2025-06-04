import AppIconButton from '@/components/AppIconButton';
import { getPersonalMessages } from '@/services/messages';
import { Badge, IconButtonProps, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MessagesButton: React.FC<IconButtonProps> = ({ ...restOfProps }) => {
  const { pathname } = useLocation();
  const [messages, setMessages] = useState<number>();

  const fetchMessages = async () => {
    const response = await getPersonalMessages();
    if (!response.error) setMessages(response.data?.length || 0);
  };

  useEffect(() => {
    fetchMessages();
  }, [pathname]);

  return typeof messages === 'number' ? (
    <Badge
      badgeContent={messages}
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
