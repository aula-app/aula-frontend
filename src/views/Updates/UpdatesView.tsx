import { AppIcon, AppLink } from '@/components';
import IdeaCard from '@/components/IdeaCard';
import MessageCard from '@/components/MessageCard';
import { MessageType } from '@/types/Scopes';
import { databaseRequest, messageConsentValues } from '@/utils';
import { Card, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
                <Card
                  sx={{
                    borderRadius: '25px',
                    overflow: 'hidden',
                    scrollSnapAlign: 'center',
                    px: 3,
                    mb: 1,
                  }}
                  variant="outlined"
                >
                  <AppLink to={`/room/${vote.room_id}/phase/30/idea-box/${vote.topic_id}/idea/${vote.idea_id}`}>
                    <Stack direction="row" height={68} alignItems="center">
                      <AppIcon icon="voting" sx={{ mr: 2 }} />
                      new vote for
                      <Typography ml={0.5} fontWeight={800}>
                        {vote.title}
                      </Typography>
                    </Stack>
                  </AppLink>
                </Card>
              ))}
            </>
          )}
          {updates.comments && updates.comments.length > 0 && (
            <>
              <Typography variant="h4" sx={{ p: 2, pb: 1.75, textTransform: 'capitalize', flex: 1 }}>
                {updates.comments.length} new comments
              </Typography>

              {updates.comments.map((comment) => (
                <AppLink to={`/Updates/message/${comment.id}`} key={comment.id}>
                  {comment.name}
                </AppLink>
              ))}
            </>
          )}
        </>
      )}
    </Stack>
  );
};

export default UpdatesView;
