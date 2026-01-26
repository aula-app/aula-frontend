import Icon from '@/components/new/Icon';
import IconButton from '@/components/new/IconButton';
import { getPersonalMessages } from '@/services/messages';
import { Badge, IconButtonProps, Skeleton } from '@mui/material';
import { t } from 'i18next';
import { forwardRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const MessagesButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ ...restOfProps }, ref) => {
  const { pathname } = useLocation();
  const [messages, setMessages] = useState<number>();

  const fetchMessages = async () => {
    const response = await getPersonalMessages();
    setMessages(response.data?.length || 0);
  };

  useEffect(() => {
    fetchMessages();
  }, [pathname]);

  return typeof messages === 'number' ? (
    messages !== 0 ? (
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
        <IconButton title={t('tooltips.message')} to="/messages" {...restOfProps}>
          <Icon type="message" size="1.5rem" />
        </IconButton>
      </Badge>
    ) : (
      <IconButton title={t('tooltips.message')} to="/messages" {...restOfProps}>
        <Icon type="message" size="1.5rem" />
      </IconButton>
    )
  ) : (
    <Skeleton variant="circular" sx={{ width: 20, aspectRatio: 1, mx: 1 }} />
  );
});

MessagesButton.displayName = 'MessagesButton';

export default MessagesButton;
