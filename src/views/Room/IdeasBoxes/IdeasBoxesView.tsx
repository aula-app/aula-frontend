import { Fab, Grid, Stack } from '@mui/material';
import { IdeaBox } from '@/components/IdeaBox';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { databaseRequest } from '@/utils/requests';
import { BoxesResponseType } from '@/types/scopes/BoxTypes';
import { AppIcon } from '@/components';
import AlterData from '@/components/AlterData';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/:phase
 */
const IdeasBoxView = () => {
  const goto = useNavigate();
  const params = useParams();
  const [add, setAdd] = useState(false);
  const [boxes, setBoxes] = useState<BoxesResponseType>();

  const boxesFetch = async () =>
    await databaseRequest({
      model: 'Topic',
      method: 'getTopicsByPhase',
      arguments: {
        offset: 0,
        limit: 0,
        room_id: Number(params['room_id']),
        phase_id: Number(params['phase']),
      },
    }).then((response) => setBoxes(response));

  const closeAdd = () => {
    boxesFetch();
    setAdd(false);
  };

  useEffect(() => {
    //@ts-ignore
    if (params.phase) boxesFetch();
    else goto('/error');
  }, [params['phase']]);

  return (
    <Stack alignItems="center">
      <Grid container spacing={2} p={1}>
        {boxes &&
          boxes.data &&
          boxes.data.map((box) => (
            <Grid key={box.id} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ scrollSnapAlign: 'center' }}>
              <IdeaBox box={box} onReload={boxesFetch} />
            </Grid>
          ))}
      </Grid>
      <Fab
        aria-label="add"
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 40,
        }}
        onClick={() => setAdd(true)}
      >
        <AppIcon icon="add" />
      </Fab>
      <AlterData scope="boxes" isOpen={add} otherData={{ room_id: params.room_id }} onClose={closeAdd} />
    </Stack>
  );
};

export default IdeasBoxView;
