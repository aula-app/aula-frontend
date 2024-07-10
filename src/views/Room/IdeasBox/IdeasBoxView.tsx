import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { IdeaCard } from '@/components/IdeaCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BoxResponseType } from '@/types/scopes/BoxTypes';
import { databaseRequest, phases } from '@/utils';
import { IdeasResponseType } from '@/types/scopes/IdeaTypes';
import { AppIcon, AppLink } from '@/components';
import { grey } from '@mui/material/colors';
import DelegateVote from '@/components/DelegateVote';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/ideas-box/:box_id
 */
const IdeasBoxView = () => {
  const params = useParams();
  const [box, setBox] = useState<BoxResponseType>();
  const [boxIdeas, setBoxIdeas] = useState<IdeasResponseType>();
  const [delegation, setDelegation] = useState(false)

  const boxFetch = async () =>
    await databaseRequest({
      model: 'Topic',
      method: 'getTopicBaseData',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response) => setBox(response));

  const boxIdeasFetch = async () =>
    await databaseRequest({
      model: 'Idea',
      method: 'getIdeasByTopic',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response) => setBoxIdeas(response));

  useEffect(() => {
    boxFetch();
    boxIdeasFetch();
  }, []);

  return (
    <>
      <Box
        height="100%"
        flexGrow={1}
        position="relative"
        px={1}
        py={2}
        sx={{
          overflowY: 'auto',
          scrollSnapType: 'y mandatory',
        }}
      >
        {box && box.data && boxIdeas && boxIdeas.data && (
          <>
            <IdeaBox box={box.data || {}} noLink onReload={boxFetch} />
            <Stack direction="row">
              <Typography variant="h6" p={2}>
                {String(boxIdeas.count)} ideas {phases[box.data.phase_id].call}
              </Typography>
              {Number(box.data.phase_id) === 30 && (
                <Button
                  size="small"
                  sx={{ ml: 'auto', mt: 0.5, px: 1, bgcolor: '#fff', color: grey[600], borderRadius: 5 }}
                  onClick={() => setDelegation(true)}
                >
                  <Typography variant="caption">or</Typography>
                  <Typography variant="caption" color="primary" fontWeight={700} sx={{ mx: 1 }}>
                    DELEGATE VOTE
                  </Typography>
                  <AppIcon icon="delegate" size="small" />
                </Button>
              )}
            </Stack>
            <Grid container spacing={1}>
              {boxIdeas.data.map((idea, key) => (
                <Grid
                  key={key}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  sx={{ scrollSnapAlign: 'center' }}
                  order={-idea.approved}
                >
                  <AppLink to={`idea/${idea.id}`}>
                  <IdeaCard idea={idea} phase={box.data.phase_id} />
                  </AppLink>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
      <DelegateVote isOpen={delegation} onClose={() => setDelegation(false)} />
    </>
  );
};

export default IdeasBoxView;
