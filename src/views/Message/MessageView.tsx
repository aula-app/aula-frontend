import { AppButton, AppIcon } from '@/components';
import { MessageType, messageConsentValues } from '@/types/MessageTypes';
import { localStorageGet } from '@/utils';
import { databaseRequest } from '@/utils/requests';
import { IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const jwt_token = localStorageGet('token');
  const params = useParams();
  const [message, setMessage] = useState<MessageType>();

  const messageFetch = async () =>
    await databaseRequest('model', {
      model: 'Text',
      method: 'getTextBaseData',
      arguments: {
        text_id: params['message_id'],
      },
    }).then((response) => {
      setMessage(response.data);
    });

  const giveConsent = async (text_id: number) =>
    await fetch(import.meta.env.VITE_APP_API_URL + '/api/controllers/give_consent.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwt_token,
      },
      body: JSON.stringify({ text_id: text_id }),
    });

  useEffect(() => {
    messageFetch();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {message && (
        <Stack flex={1}>
          <Typography fontWeight={700} align='center' py={2}>
            {message.headline}
          </Typography>
          <Stack flex={1} alignItems="center">
            <Typography>{message.body}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="end">
          {/* <IconButton>
            <AppIcon icon="delete" />
          </IconButton> */}
            {message.user_needs_to_consent > 0 && (
              <AppButton color="primary" onClick={() => giveConsent(message.id)}>
                {message.consent_text}
              </AppButton>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default MessagesView;
