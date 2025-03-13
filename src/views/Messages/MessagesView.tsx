import { useAppStore } from '@/store/AppStore';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MessageCard from '@/components/MessageCard';
import { useEffect } from 'react';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const [appState, dispatch] = useAppStore();

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.messages'), '']] });
  }, []);

  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Typography variant="h2" py={2}>
        {t('scopes.messages.plural')}
      </Typography>
      <MessageCard type="messages" />
      <MessageCard type="announcements" />
      <MessageCard type="requests" />
      <MessageCard type="reports" />
    </Stack>
  );
};

export default MessagesView;
