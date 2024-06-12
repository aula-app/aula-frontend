import { Grid, Stack } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { BoxType, BoxesResponseType } from '@/types/BoxTypes';
import { AppLink } from '@/components';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { databaseRequest } from '@/utils/requests';
import { phases } from '@/utils/phases';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/:phase
 */
const IdeasBoxView = () => {
  const goto = useNavigate();
  const params = useParams();
  const [boxes, setBoxes] = useState({} as BoxesResponseType);

  const boxesFetch = async (currentPhase: number) =>
    await databaseRequest('model', {
      model: 'Topic',
      method: 'getTopicsByPhase',
      arguments: {
        room_id: Number(params['room_id']),
        phase_id: currentPhase,
      },
      decrypt: ['name', 'description_public'],
    }).then((response) => setBoxes(response));

  useEffect(() => {
    //@ts-ignore
    if(params.phase && Object.hasOwn(phases, params.phase)) boxesFetch(phases[params.phase].id)
    else goto('/error');
  }, []);

  return (
    <Grid container spacing={2}>
      {boxes.data && boxes.data.map((box) => (
        <Grid key={box.id} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ scrollSnapAlign: 'center' }}>
          <AppLink to={`/room/${params.room_id}/idea-box/${box.id}`} mb={2} key={box.id}>
            <IdeaBox box={box} />
          </AppLink>
        </Grid>
      ))}
    </Grid>
  );
};

export default IdeasBoxView;
