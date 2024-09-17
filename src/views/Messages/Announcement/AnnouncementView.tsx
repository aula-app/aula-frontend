import { AppButton } from '@/components';
import { AnnouncementType, MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Renders "Messages" view
 * url: /messages
 */

const AnnouncementView = () => {
  const params = useParams();
  const [message, setMessage] = useState<MessageType | AnnouncementType>();

  const messageFetch = async () =>
    await databaseRequest({
      model: 'Text',
      method: 'getTextBaseData',
      arguments: {
        text_id: params['message_id'],
      },
    }).then((response) => {
      if (!response.success) return;
      setMessage(response.data);
    });

  const giveConsent = async (text_id: number) =>
    await databaseRequest(
      {
        model: 'User',
        method: 'giveConsent',
        arguments: {
          text_id: params['message_id'],
        },
      },
      ['user_id']
    );

  useEffect(() => {
    messageFetch();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {message && (
        <Stack flex={1}>
          <Typography fontWeight={700} align="center" py={2}>
            {message.headline}
          </Typography>
          <Stack flex={1} alignItems="center">
            <Typography>{message.body}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="end">
            {/* <IconButton>
            <AppIcon icon="delete" />
          </IconButton> */}
            {'user_needs_to_consent' in message && message.user_needs_to_consent > 0 && (
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

export default AnnouncementView;
