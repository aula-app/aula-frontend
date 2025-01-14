import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MessageCard from '@/components/MessageCard';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const { t } = useTranslation();

  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Typography variant="h5" py={2}>
        {t('scopes.messages.plural')}
      </Typography>
      <MessageCard type="message" />
      <MessageCard type="announcement" />
      <MessageCard type="request" />
      <MessageCard type="report" />
    </Stack>
  );
};

export default MessagesView;
