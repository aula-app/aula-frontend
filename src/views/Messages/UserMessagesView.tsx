import { useAppStore } from '@/store/AppStore';
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MessageCard from '@/components/MessageCard';
import { useEffect } from 'react';
import { checkPermissions } from '@/utils';

/**
 * Renders "Messages" view
 * url: /messages
 */

const UserMessagesView = () => {
  const { t } = useTranslation();
  const [appState, dispatch] = useAppStore();

  useEffect(() => {
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.messages'), '']] });
  }, []);

  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <MessageCard type="messages" />
      {checkPermissions('requests', 'viewAll') && <MessageCard type="requests" />}
      {checkPermissions('reports', 'viewAll') && <MessageCard type="reports" />}
    </Stack>
  );
};

export default UserMessagesView;
