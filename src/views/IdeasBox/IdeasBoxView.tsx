import { Box, Grid, Typography } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { IdeaCard } from '@/components/IdeaCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BoxResponseType } from '@/types/scopes/BoxTypes';
import { databaseRequest } from '@/utils';
import { IdeasResponseType } from '@/types/scopes/IdeaTypes';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/ideas-box/:box_id
 */
const IdeasBoxView = () => {
  const params = useParams();
  const [box, setBox] = useState({} as BoxResponseType);
  const [boxIdeas, setBoxIdeas] = useState({} as IdeasResponseType);

  const boxFetch = async () =>
    await databaseRequest('model', {
      model: 'Topic',
      method: 'getTopicBaseData',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response) => setBox(response));

  const boxIdeasFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeasByTopic',
      arguments: { topic_id: Number(params['box_id']) },
    }).then((response) => setBoxIdeas(response));

  useEffect(() => {
    boxFetch();
    boxIdeasFetch();
  }, []);

  return (
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
      {box.data && <IdeaBox box={box.data || {}} noLink />}
      <Typography variant="h6" p={2}>
        {String(boxIdeas.count)} ideas
      </Typography>
      <Grid container spacing={1}>
        {boxIdeas.data &&
          boxIdeas.data.map((idea, key) => (
            <Grid key={key} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ scrollSnapAlign: 'center' }} order={-idea.approved}>
              <IdeaCard idea={idea} phase={box.data.phase_id} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default IdeasBoxView;
