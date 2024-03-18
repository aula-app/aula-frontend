import { Box, Typography } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { IdeaCard } from '@/components/IdeaCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BoxResponseType } from '@/types/BoxTypes';
import { databaseRequest } from '@/utils/requests';
import { IdeasResponseType } from '@/types/IdeaTypes';

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
      decrypt: ['name', 'description_public'],
    }).then((response) => setBox(response));

  const boxIdeasFetch = async () =>
    await databaseRequest('model', {
      model: 'Idea',
      method: 'getIdeasByTopic',
      arguments: { topic_id: Number(params['box_id']) },
      decrypt: ['content'],
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
      {box.data && <IdeaBox box={box.data || {}} />}
      <Typography variant="h6" p={2}>
        {String(boxIdeas.count)} ideas
      </Typography>
      {boxIdeas.data && (
        <>
          {boxIdeas.data.map((idea, key) => (
            <IdeaCard idea={idea} key={key} /> // phase={box.data.phase_id}
          ))}
        </>
      )}
    </Box>
  );
};

export default IdeasBoxView;
