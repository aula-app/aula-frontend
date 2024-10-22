import { AppIcon } from '@/components';
import BoxCard from '@/components/BoxCard';
import EditData from '@/components/Data/EditData';
import { BoxType } from '@/types/Scopes';
import { checkPermissions, databaseRequest } from '@/utils';
import { Fab, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/:phase
 */
const IdeasBoxView = () => {
  const goto = useNavigate();
  const params = useParams();
  const [addBox, setAddBox] = useState(false);
  const [addSurvey, setAddSurvey] = useState(false);
  const [boxes, setBoxes] = useState<BoxType[]>([]);

  const boxesFetch = async () =>
    await databaseRequest({
      model: 'Topic',
      method: 'getTopics',
      arguments: {
        offset: 0,
        limit: 0,
        room_id: Number(params['room_id']),
        phase_id: Number(params['phase']),
      },
    }).then((response) => {
      if (!response.success || !response) return;
      setBoxes(response.data as BoxType[]);
    });

  const closeAdd = () => {
    boxesFetch();
    setAddBox(false);
    setAddSurvey(false);
  };

  useEffect(() => {
    //@ts-ignore
    if (params.phase) boxesFetch();
    else goto('/error');
  }, [params['phase']]);

  return (
    <Stack alignItems="center">
      <Grid container spacing={2} p={1} width="100%">
        {boxes &&
          boxes &&
          boxes.map((box) => (
            <Grid key={box.id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
              <BoxCard box={box.id} onReload={boxesFetch} />
            </Grid>
          ))}
      </Grid>
      {checkPermissions(30) && (
        <Stack direction="row" sx={{ position: 'fixed', bottom: 40 }} gap={5}>
          <Fab aria-label="add" color="primary" onClick={() => setAddBox(true)}>
            <AppIcon icon="box" />
          </Fab>
          {Number(params['phase']) === 30 && (
            <Fab aria-label="add" color="primary" onClick={() => setAddSurvey(true)}>
              <AppIcon icon="survey" />
            </Fab>
          )}
          <EditData scope="boxes" isOpen={addBox} otherData={{ room_id: params.room_id }} onClose={closeAdd} />
          <EditData scope="surveys" isOpen={addSurvey} otherData={{ room_id: params.room_id }} onClose={closeAdd} />
        </Stack>
      )}
    </Stack>
  );
};

export default IdeasBoxView;
