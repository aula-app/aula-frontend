import { AppIcon, AppLink } from '@/components';
import MessageCard from '@/components/MessageCard';
import { MessageType } from '@/types/Scopes';
import { databaseRequest, messageConsentValues } from '@/utils';
import { IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * Renders "Updates" view
 * url: /updates
 */

const UpdatesView = () => {
  const [Updates, setUpdates] = useState<MessageType[]>();

  const messageFetch = async () =>
    await databaseRequest(
      {
        model: 'Idea',
        method: 'getUpdatesByUser',
        arguments: {},
      },
      ['user_id']
    ).then((response) => {
      // console.log(response.data);
      setUpdates(response.data);
    });

  useEffect(() => {
    messageFetch();
  }, []);

  return (
    <Stack p={2} sx={{ overflowY: 'auto' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" py={2}>
          Updates
        </Typography>
        <IconButton>
          <AppIcon icon="filter" />
        </IconButton>
      </Stack>
      {Updates &&
        Updates.length > 0 &&
        Updates.map((update) => (
          <AppLink to={`/Updates/message/${update.id}`} key={update.id}>
            <MessageCard type={messageConsentValues[update.user_needs_to_consent]} title={update.headline} />
          </AppLink>
        ))}
    </Stack>
  );
};

export default UpdatesView;
