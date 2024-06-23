import { AppIcon } from '@/components';
import MessageCard from '@/components/MessageCard';
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
  const [messages, setMessages] = useState([])

  const messageFetch = async () =>
    await databaseRequest('model', {
      model: 'Message',
      method: 'getMessagesByUser',
      arguments: { user_id: jwt_payload.user_id },
      decrypt: ['content', 'displayname'],
    }).then((response) => {
      console.log(response);
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
      <MessageCard type="message" />
      <MessageCard type="announcement" />
      <MessageCard type="alert" />
    </Stack>
  );
};

export default MessagesView;
