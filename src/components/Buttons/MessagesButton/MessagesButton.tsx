import AppIconButton from '@/components/AppIconButton';
import { getAnnouncements } from '@/services/announcements';
import { getPersonalMessages } from '@/services/messages';
import { Badge, IconButtonProps, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const MessagesButton: React.FC<IconButtonProps> = ({ ...restOfProps }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
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
      aria-label={t('scopes.messages.plural', { count: messages })}
    >
      <AppIconButton 
        icon="message" 
        to="/messages" 
        aria-label={t('ui.navigation.messages')}
        title={t('ui.navigation.messages')} 
        {...restOfProps} 
      />
    </Badge>
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} aria-hidden="true" />
  );
};

export default MessagesButton;
