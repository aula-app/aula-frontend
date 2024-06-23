import { AppIcon, AppLink } from '@/components';
import MessageCard from '@/components/MessageCard';
import { MessageType, messageConsentValues } from '@/types/MessageTypes';
import { localStorageGet } from '@/utils';
import { parseJwt } from '@/utils/jwt';
import { databaseRequest } from '@/utils/requests';
import { IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
  const [messages, setMessages] = useState<MessageType[]>();

  const messageFetch = async () =>
    await databaseRequest('model', {
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
          Messages
        </Typography>
        <IconButton>
          <AppIcon icon="filter" />
        </IconButton>
      </Stack>
      {messages &&
        messages.length > 0 &&
        messages.map((message) => (
          <AppLink to={`/messages/${message.id}`}>
            <MessageCard type={messageConsentValues[message.user_needs_to_consent]} title={message.headline} />
          </AppLink>
        ))}
    </Stack>
  );
};

export default MessagesView;
