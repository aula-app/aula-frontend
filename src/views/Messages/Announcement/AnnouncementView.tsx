import { AppButton } from '@/components';
import { AnnouncementType, MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Button, Card, CardActions, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Renders "Messages" view
 * url: /messages
 */

const AnnouncementView = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<MessageType | AnnouncementType>();

  const messageFetch = async () =>
    await databaseRequest({
      model: 'Text',
      method: 'getTextBaseData',
      arguments: {
        text_id: params['message_id'],
      },
    }).then((response) => {
      if (!response.success || !response.data) return;
      setMessage(response.data);
    });

  const giveConsent = async () =>
    await databaseRequest(
      {
        model: 'User',
        method: 'giveConsent',
        arguments: {
          text_id: params['message_id'],
        },
      },
      ['user_id']
    ).then((response) => {
      if (response.success) onArchive(true);
    });

  const onArchive = async (setArchived: boolean) => {
    if (!message) return;
    await databaseRequest(
      {
        model: 'Text',
        method: 'setTextStatus',
        arguments: {
          status: setArchived ? 3 : 1,
          text_id: message.id,
        },
      },
      ['updater_id']
    ).then(() => navigate('/messages'));
  };

  useEffect(() => {
    messageFetch();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {message ? (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" py={2}>
              {message.headline}
            </Typography>
            <Typography py={2}>{message.body}</Typography>
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
                    {message.status === 1 ? t('actions.archive') : t('actions.unarchive')}
                  </Button>
                )}
                {message.user_needs_to_consent > 0 && (
                  <AppButton color="primary" onClick={giveConsent}>
                    {message.consent_text}
                  </AppButton>
                )}
              </>
            )}
          </CardActions>
        </Card>
      ) : (
        <Card variant="outlined">
          <CardContent>
            <Skeleton variant="rectangular" height={24} width="30%" sx={{ mb: 3 }} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="75%" />
          </CardContent>
          <Divider />
          <CardActions>
            <Skeleton variant="rectangular" width={100} sx={{ ml: 'auto', mr: 2, my: 1 }} />
          </CardActions>
        </Card>
      )}
    </Stack>
  );
};

export default AnnouncementView;
