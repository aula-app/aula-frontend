import { AppIcon, AppLink } from '@/components';
import IdeaCard from '@/components/IdeaCard';
import MessageCard from '@/components/MessageCard';
import { MessageType } from '@/types/Scopes';
import { databaseRequest, messageConsentValues } from '@/utils';
import { Card, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UpdateCard from './UpdateCard';

/**
 * Renders "Updates" view
 * url: /updates
 */

const UpdatesView = () => {
  const { t } = useTranslation();
  const [updates, setUpdates] = useState<MessageType[]>();

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
        <Typography variant="h4" sx={{ p: 2, pb: 1.75, textTransform: 'capitalize', flex: 1 }}>
          {t('views.updates')}
        </Typography>
        <IconButton>
          <AppIcon icon="filter" />
        </IconButton>
      </Stack>
      {updates && (
        <>
          {updates.votes && updates.votes.length > 0 && (
            <>
              <Typography variant="h4" sx={{ p: 2, pb: 1.75, textTransform: 'capitalize', flex: 1 }}>
                {updates.votes.length} new votes
              </Typography>

              {updates.votes.map((vote, key) => (
                <UpdateCard item={vote} icon="voting" variant="vote" key={key} />
              ))}
            </>
          )}
          {updates.comments && updates.comments.length > 0 && (
            <>
              <Typography variant="h4" sx={{ p: 2, pb: 1.75, textTransform: 'capitalize', flex: 1 }}>
                {updates.comments.length} new comments
              </Typography>

              {updates.comments.map((comment) => (
                <UpdateCard item={comment} icon="comment" variant="comment" key={`c_${comment.id}`} />
              ))}
            </>
          )}
        </>
      )}
    </Stack>
  );
};

export default UpdatesView;
