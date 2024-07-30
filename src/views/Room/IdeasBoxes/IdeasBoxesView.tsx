import { AppIcon } from '@/components';
import { AlterData, MoveData } from '@/components/Data';
import { IdeaBox } from '@/components/IdeaComponents';
import { BoxesResponseType } from '@/types/RequestTypes';
import { databaseRequest, localStorageGet, parseJwt } from '@/utils';
import { Fab, Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/:phase
 */
const IdeasBoxView = () => {
  const jwt_token = localStorageGet('token');
  const jwt_payload = parseJwt(jwt_token);
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
      {jwt_payload.user_level >= 50 && <MoveData parentId={Number(params.room_id)} scope="users" />}
      <Grid container spacing={2} p={1}>
        {boxes &&
          boxes.data &&
          boxes.data.map((box) => (
            <Grid key={box.id} item xs={12} sm={6} lg={4} xl={3} sx={{ scrollSnapAlign: 'center' }}>
              <IdeaBox box={box} onReload={boxesFetch} />
            </Grid>
          ))}
      </Grid>
      {jwt_payload.user_level >= 50 && (
        <>
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
        </>
      )}
    </Stack>
  );
};

export default IdeasBoxView;
