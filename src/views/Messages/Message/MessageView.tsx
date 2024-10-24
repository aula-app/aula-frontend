import { AnnouncementType, MessageType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import { Button, Card, CardActions, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

/**
 * Renders "Messages" view
 * url: /messages
 */

const MessagesView = () => {
  const { t } = useTranslation();
  const params = useParams();
  const [message, setMessage] = useState<MessageType | AnnouncementType>();

  const messageFetch = async () =>
    await databaseRequest({
      model: 'Message',
      method: 'getMessageBaseData',
      arguments: {
        message_id: params['message_id'],
      },
    }).then((response) => {
      if (!response.success || !response.data) return;
      setMessage(response.data);
    });

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
      {message ? (
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
          <CardActions>
            <Button
              color="error"
              onClick={() => onArchive(message.status === 1 ? true : false)}
              sx={{ ml: 'auto', mr: 2, my: 1 }}
            >
              {message.status === 1 ? t(`texts.archive`) : t(`texts.unarchive`)}
            </Button>
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

export default MessagesView;
