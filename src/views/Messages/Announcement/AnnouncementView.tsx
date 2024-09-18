import { AppButton } from '@/components';
import { AnnouncementType, MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Button, Card, CardActions, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/**
 * Renders "Messages" view
 * url: /messages
 */

const AnnouncementView = () => {
  const { t } = useTranslation();
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

  const onArchive = async (value: boolean) => {
    if (!message) return;
    await databaseRequest(
      {
        model: 'Message',
        method: 'setMessageStatus',
        arguments: {
          status: value ? 3 : 1,
          message_id: message.id,
        },
      },
      ['updater_id']
    ).then(() => messageFetch());
  };

  useEffect(() => {
    messageFetch();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {message && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" py={2}>
              {message.headline}
            </Typography>
            <Typography py={2}>
              <Typography>{message.body}</Typography>
            </Typography>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'end' }}>
            {'user_needs_to_consent' in message && (
              <>
                {message.user_needs_to_consent < 2 && (
                  <Button
                    color="error"
                    onClick={() => onArchive(message.status === 1 ? true : false)}
                    sx={{ ml: 'auto', mr: 2, my: 1 }}
                  >
                    {message.status === 1 ? t(`texts.archive`) : t(`texts.unarchive`)}
                  </Button>
                )}
                {message.user_needs_to_consent > 0 && (
                  <AppButton color="primary" onClick={() => giveConsent(message.id)}>
                    {message.consent_text}
                  </AppButton>
                )}
              </>
            )}
          </CardActions>
        </Card>
      )}
    </Stack>
  );
};

export default AnnouncementView;
