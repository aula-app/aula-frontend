import { AppIcon, AppLink } from '@/components';
import MessageCard from '@/components/MessageCard';
import { MessageType } from '@/types/Scopes';
import { databaseRequest, messageConsentValues } from '@/utils';
import { IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<MessageType[]>();

  const messageFetch = async () =>
    await databaseRequest({
      model: 'Text',
      method: 'getTexts',
      arguments: {},
    }).then((response) => {
      setMessages(response.data);
    });

  useEffect(() => {
    messageFetch();
  }, []);

  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" py={2}>
          {t('views.messages')}
        </Typography>
        <IconButton>
          <AppIcon icon="filter" />
        </IconButton>
      </Stack>
      {messages &&
        messages.length > 0 &&
        messages.map((message) => (
          <AppLink to={`/messages/message/${message.id}`} key={message.id}>
            <MessageCard type={messageConsentValues[message.user_needs_to_consent]} title={message.headline} />
          </AppLink>
        ))}
    </Stack>
  );
};

export default MessagesView;
