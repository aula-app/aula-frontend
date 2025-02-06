import { AppIconButton } from '@/components';
import { getMessage, setMessageStatus } from '@/services/messages';
import { MessageType } from '@/types/Scopes';
import { Card, CardActions, CardContent, CardHeader, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Renders "Message" view
 * url: /messages
 */

const MessageView = () => {
  const navigate = useNavigate();
  const { message_id } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageType | MessageType>();

  const fetchMessage = useCallback(async () => {
    if (!message_id) return;
    setLoading(true);
    const response = await getMessage(message_id);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setMessage(response.data);
    setLoading(false);
  }, [message_id]);

  const archiveMessage = async () => {
    if (!message) return;
    setMessageStatus({
      status: 3,
      message_id: message.hash_id,
    }).then(onReload);
  };

  const unarchiveMessage = async () => {
    if (!message) return;
    setMessageStatus({
      status: 1,
      message_id: message.hash_id,
    }).then(onReload);
  };

  const toggleArchive = () => {
    if (!message) return;
    message.status === 1 ? archiveMessage() : unarchiveMessage();
  };

  const onReload = () => navigate('/messages');

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {isLoading && (
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
      {error && <Typography variant="h5">{error}</Typography>}
      {!isLoading && message && (
        <Card variant="outlined">
          <CardHeader
            title={message.headline}
            action={<AppIconButton icon={message.status === 1 ? 'archive' : 'unarchive'} onClick={toggleArchive} />}
          />
          <CardContent>
            <Typography py={2}>{message.body}</Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default MessageView;
