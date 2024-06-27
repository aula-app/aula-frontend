import { Grid } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { BoxesResponseType } from '@/types/BoxTypes';
import { AppLink } from '@/components';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { databaseRequest } from '@/utils/requests';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/:phase
 */
const IdeasBoxView = () => {
  const goto = useNavigate();
  const params = useParams();
  const [boxes, setBoxes] = useState({} as BoxesResponseType);

  const boxesFetch = async () =>
    await databaseRequest('model', {
      model: 'Topic',
      method: 'getTopicsByPhase',
      arguments: {
        offset: 0,
        limit: 0,
        room_id: Number(params['room_id']),
        phase_id: Number(params['phase']),
      },
      decrypt: ['name', 'description_public'],
    }).then((response) => setBoxes(response));

  useEffect(() => {
    //@ts-ignore
    if(params.phase) boxesFetch()
    else goto('/error');
  }, [params['phase']]);

  return (
    <Grid container spacing={2}>
      {boxes.data && boxes.data.map((box) => (
        <Grid key={box.id} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ scrollSnapAlign: 'center' }}>
          <AppLink to={`idea-box/${box.id}`} mb={2} key={box.id}>
            <IdeaBox box={box} />
          </AppLink>
        </Grid>
      ))}
    </Grid>
  );
};

export default IdeasBoxView;
