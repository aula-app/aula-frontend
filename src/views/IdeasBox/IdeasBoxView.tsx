import { Box, Typography } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { IdeaCard } from '@/components/IdeaCard';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BoxResponseType, BoxType } from '@/types/BoxTypes';
import { databaseRequest } from '@/utils/requests';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/ideas-box/:box_id
 */
const IdeasBoxView = () => {
  const params = useParams();
  const [box, setBox] = useState({} as BoxResponseType);

  const boxFetch = async () =>
    await databaseRequest('model', {
      model: 'Topic',
      method: 'getTopicBaseData',
      arguments: { topic_id: Number(params['box_id']) },
      decrypt: ['name', 'description_public'],
    })
    .then((response) => setBox(response));

    useEffect(() => { boxFetch() }, []);

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
        X ideas
      </Typography>
      {/* <IdeaCard />
      <IdeaCard variant="approved" />
      <IdeaCard variant="dismissed" />
      <IdeaCard variant="voting" />
      <IdeaCard variant="voted" />
      <IdeaCard variant="rejected" /> */}
    </Box>
  );
};

export default IdeasBoxView;
