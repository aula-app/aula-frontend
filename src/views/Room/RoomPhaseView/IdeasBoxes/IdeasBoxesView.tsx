import { AppIcon } from '@/components';
import BoxCard from '@/components/BoxCard';
import BoxCardSkeleton from '@/components/BoxCard/BoxCardSkeleton';
import EditData from '@/components/Data/EditData';
import { getBoxesByPhase } from '@/services/boxes';
import { BoxType } from '@/types/Scopes';
import { checkPermissions, databaseRequest } from '@/utils';
import { Fab, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

/** * Renders "IdeasBox" view
 * url: /room/:room_id/:phase
 */
const IdeasBoxView = () => {
  const { t } = useTranslation();
  const { room_id, phase } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<BoxType[]>([]);

  const fetchBoxes = useCallback(async () => {
    if (!room_id || !phase) return;
    setLoading(true);
    const response = await getBoxesByPhase(Number(phase), room_id);
    setLoading(false);
    setError(response.error);
    if (!response.error && response.data) setBoxes(response.data);
    setLoading(false);
  }, [room_id, phase]);

  useEffect(() => {
    fetchBoxes();
  }, []);

  return (
    <Stack alignItems="center">
      <Grid container spacing={2} p={1} width="100%">
        {isLoading && (
          <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
            <BoxCardSkeleton />
          </Grid>
        )}
        {error && <Typography>{t(error)}</Typography>}
        {!isLoading &&
          boxes.map((box) => (
            <Grid key={box.hash_id} size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} sx={{ scrollSnapAlign: 'center' }}>
              <BoxCard box={box} onReload={fetchBoxes} />
            </Grid>
          ))}
      </Grid>
      {/* {checkPermissions(30) && (
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
      )} */}
    </Stack>
  );
};

export default IdeasBoxView;
