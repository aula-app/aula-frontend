import { AppIcon, AppIconButton, AppLink } from '@/components';
import { getAdminMessages, getPersonalMessages } from '@/services/messages';
import { useAppStore } from '@/store/AppStore';
import { MessageType } from '@/types/Scopes';
import { checkPermissions } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Renders "Messages" view
 * url: /messages
 */

const UserMessagesView = () => {
  const { t } = useTranslation();
  const [appState, dispatch] = useAppStore();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const fetchMessages = async () => {
    setLoading(true);
    const response = checkPermissions('reports', 'viewAll') ? await getAdminMessages() : await getPersonalMessages();
    if (response.error) setError(response.error);
    if (!response.error && response.data) setMessages(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    dispatch({ action: 'SET_BREADCRUMB', breadcrumb: [[t('ui.navigation.messages'), '']] });
  }, []);

  return (
    <Stack gap={1} p={2} sx={{ overflowY: 'auto' }}>
      <Typography variant="h1">{t('scopes.messages.plural')}</Typography>
      {
        <>
          {messages.map((message) => {
            const variant =
              message.msg_type === 4
                ? 'reports'
                : message.msg_type === 5
                  ? 'bugs'
                  : message.msg_type === 6
                    ? 'requests'
                    : 'messages';
            return (
              <Stack
                key={message.id}
                component={AppLink}
                direction="row"
                alignItems="center"
                borderRadius={5}
                p={1}
                pl={2}
                to={`/${variant}/${message.hash_id}`}
                bgcolor={`${variant}.main`}
              >
                <AppIcon icon={variant} />
                <Typography flex={1} px={2}>
                  {message.headline}
                </Typography>
                <AppIconButton size="small" icon="close" />
              </Stack>
            );
          })}
        </>
      }
    </Stack>
  );
};

export default UserMessagesView;
